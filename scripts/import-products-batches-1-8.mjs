#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const reportDir = path.join(repoRoot, "reports", "product-import-batches-1-8");
const rawJsonPath = path.join(reportDir, "raw-input.json");
const catalogueRootSlug = "crockery-website-product-categories";
const expectedPackageDirName =
  "Hira_Website_Product_Images_Batches_1_to_8_Combined_2026-07-13";

class ImportNoopWebSocket {}

const args = process.argv.slice(2);
const shouldApply = args.includes("--apply");
const isDryRun = args.includes("--dry-run") || !shouldApply;
const packageDirArg = getArgValue("--package-dir") ?? process.env.PRODUCT_IMPORT_PACKAGE_DIR;

function getArgValue(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
}

function fail(message, details = []) {
  const error = new Error(message);
  error.details = details;
  throw error;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] ??= value;
  }
}

function findPackageDir() {
  const candidates = [
    packageDirArg,
    path.join(repoRoot, expectedPackageDirName),
    path.join(repoRoot, "import", expectedPackageDirName),
    path.join(repoRoot, "..", expectedPackageDirName),
    path.join(process.env.HOME ?? "", "Downloads", expectedPackageDirName),
  ].filter(Boolean);

  const found = candidates.find(
    (candidate) =>
      fs.existsSync(path.join(candidate, "master-product-manifest.csv")) &&
      fs.existsSync(path.join(candidate, "image-inventory.csv")),
  );

  if (!found) {
    fail(
      "Could not locate master-product-manifest.csv and image-inventory.csv. Pass --package-dir <path>.",
      candidates,
    );
  }

  return path.resolve(found);
}

function runCsvNormalizer(packageDir) {
  fs.mkdirSync(reportDir, { recursive: true });
  const result = spawnSync(
    "python3",
    [
      path.join(repoRoot, "scripts", "prepare-product-import.py"),
      "--package-dir",
      packageDir,
      "--out",
      rawJsonPath,
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );

  if (result.status !== 0) {
    fail("CSV normalization failed.", [
      result.stdout.trim(),
      result.stderr.trim(),
    ].filter(Boolean));
  }

  return JSON.parse(fs.readFileSync(rawJsonPath, "utf8"));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getNormalizedProductSlug(row) {
  return `${slugify(row.product_name)}-${row.product_code.toLowerCase()}`;
}

function parseBoolean(value, context, errors) {
  if (value === "True" || value === "true" || value === "1") {
    return true;
  }

  if (value === "False" || value === "false" || value === "0") {
    return false;
  }

  errors.push(`${context}: invalid boolean "${value}"`);
  return false;
}

function parseSortOrder(value, context, errors) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    errors.push(`${context}: invalid sort_order "${value}"`);
    return 0;
  }

  return parsed;
}

function parseGalleryImages(value) {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index);
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function getStringList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProductDescription(row) {
  const details = [
    row.finish ? `Finish: ${row.finish}` : null,
    row.colour ? `Colour: ${row.colour}` : null,
    row.use_case ? `Use case: ${row.use_case}` : null,
  ].filter(Boolean);

  return `${row.product_name} by Hira Industries.${details.length ? ` ${details.join(". ")}.` : ""}`;
}

function getProductShortDescription(row) {
  const parts = [
    row.finish || null,
    row.colour ? `Colours: ${row.colour}` : null,
  ].filter(Boolean);

  return parts.length ? `${parts.join(". ")}.` : `${row.product_name} by Hira Industries.`;
}

function getFeatureList(row) {
  return [
    row.finish ? `Finish: ${row.finish}` : null,
    row.colour ? `Colour: ${row.colour}` : null,
    row.use_case ? `Use case: ${row.use_case}` : null,
  ].filter(Boolean);
}

function getTagList(row, mapping) {
  return [
    mapping.mainCategoryName,
    mapping.subcategoryName,
    row.product_code.split("-")[0],
    row.batch_number ? `Batch ${row.batch_number}` : null,
  ].filter(Boolean);
}

function createSupabaseClient() {
  loadEnvFile(path.join(repoRoot, ".env.local"));
  loadEnvFile(path.join(repoRoot, ".env"));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    fail(
      "Supabase service-role credentials are not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    realtime: {
      transport: ImportNoopWebSocket,
    },
  });
}

function resolveCategoryMapping(row) {
  let mainSlug = row.main_category_slug;
  let mainName = row.main_category;
  let subSlug = row.subcategory_slug || null;
  let subName = row.subcategory || null;
  const notes = [];

  if (row.main_category_slug === "serveware") {
    mainSlug = "serving-sets";
    mainName = "Serving Sets";
    notes.push("Mapped manifest Serveware to existing Serving Sets.");

    if (row.subcategory_slug === "decorative-platters") {
      subSlug = "platter-sets";
      subName = "Platter Sets";
      notes.push("Mapped Decorative Platters to existing Platter Sets.");
    }

    if (row.subcategory_slug === "snack-plates") {
      if (row.product_name.toLowerCase().includes("platter")) {
        subSlug = "platter-sets";
        subName = "Platter Sets";
        notes.push("Mapped serveware snack-platter product to Platter Sets.");
      } else {
        mainSlug = "plates";
        mainName = "Plates";
        subSlug = "snack-plates";
        subName = "Snack Plates";
        notes.push("Mapped serveware Snack Plates to Plates > Snack Plates.");
      }
    }
  }

  if (row.main_category_slug === "bowls" && row.subcategory_slug === "bowl-sets") {
    subSlug = "ceramic-bowl-sets";
    subName = "Ceramic Bowl Sets";
    notes.push("Mapped Bowl Sets to existing Ceramic Bowl Sets.");
  }

  if (row.main_category_slug === "jar-storage" && !row.subcategory_slug) {
    subSlug = null;
    subName = null;
    notes.push("Blank Jar & Storage subcategory kept as null because products.subcategory_id is nullable.");
  }

  return {
    manifestMainSlug: row.main_category_slug,
    manifestSubcategorySlug: row.subcategory_slug || null,
    mainSlug,
    mainCategoryName: mainName,
    subcategorySlug: subSlug,
    subcategoryName: subName,
    notes,
  };
}

function validatePackage(rawInput) {
  const errors = [];
  const warnings = [];
  const manifestRows = rawInput.manifestRows;
  const inventoryRows = rawInput.inventoryRows;
  const inventoryByUrl = new Map(inventoryRows.map((row) => [row.image_url, row]));
  const manifestImageRefs = new Set();
  const productCodes = new Set();
  const manifestSlugs = new Set();
  const finalSlugs = new Set();
  const normalizedProducts = [];
  const slugReport = [];
  const categoryMappings = [];

  const recordCounts = manifestRows.reduce((counts, row) => {
    counts[row.record_type] = (counts[row.record_type] ?? 0) + 1;
    return counts;
  }, {});

  if (recordCounts.new_product !== 121) {
    errors.push(`Expected 121 new_product rows, found ${recordCounts.new_product ?? 0}.`);
  }

  if (recordCounts.existing_product_update !== 2) {
    errors.push(
      `Expected 2 existing_product_update rows, found ${recordCounts.existing_product_update ?? 0}.`,
    );
  }

  if (manifestRows.length !== 123) {
    errors.push(`Expected 123 manifest rows, found ${manifestRows.length}.`);
  }

  if (inventoryRows.length !== 132) {
    errors.push(`Expected 132 image inventory rows, found ${inventoryRows.length}.`);
  }

  for (const row of manifestRows) {
    const context = row.product_code || row.product_name || "manifest row";

    if (!row.product_code?.trim()) {
      errors.push(`${context}: product_code is required.`);
    }

    if (!row.product_name?.trim()) {
      errors.push(`${context}: product_name is required.`);
    }

    if (productCodes.has(row.product_code)) {
      errors.push(`${context}: duplicate product_code.`);
    }
    productCodes.add(row.product_code);

    if (manifestSlugs.has(row.slug)) {
      errors.push(`${context}: duplicate manifest slug.`);
    }
    manifestSlugs.add(row.slug);

    const galleryImages = parseGalleryImages(row.gallery_images);
    if (!galleryImages.includes(row.image_url)) {
      galleryImages.unshift(row.image_url);
    }

    const finalSlug =
      row.record_type === "new_product" ? getNormalizedProductSlug(row) : row.slug;

    if (finalSlugs.has(finalSlug)) {
      errors.push(`${context}: duplicate final slug "${finalSlug}".`);
    }
    finalSlugs.add(finalSlug);

    const imageRefs = [row.image_url, ...galleryImages].filter(Boolean);
    for (const imageUrl of imageRefs) {
      manifestImageRefs.add(imageUrl);

      if (!imageUrl.startsWith("/images/products/")) {
        errors.push(`${context}: image is outside /images/products/: ${imageUrl}`);
      }

      if (!imageUrl.endsWith(".webp")) {
        errors.push(`${context}: image is not WebP: ${imageUrl}`);
      }

      if (!inventoryByUrl.has(imageUrl)) {
        errors.push(`${context}: image missing from image-inventory.csv: ${imageUrl}`);
      }

      const imagePath = path.join(repoRoot, "public", imageUrl.replace(/^\//, ""));
      if (!fs.existsSync(imagePath)) {
        errors.push(`${context}: image missing from repository: ${imageUrl}`);
      } else {
        const inventory = inventoryByUrl.get(imageUrl);
        const actualHash = sha256File(imagePath);
        if (inventory?.sha256 && inventory.sha256 !== actualHash) {
          errors.push(`${context}: SHA-256 mismatch for ${imageUrl}.`);
        }
      }
    }

    parseBoolean(row.is_active, context, errors);
    const sortOrder = parseSortOrder(row.sort_order, context, errors);
    const mapping = resolveCategoryMapping(row);
    categoryMappings.push({
      product_code: row.product_code,
      manifest_main_category_slug: mapping.manifestMainSlug,
      manifest_subcategory_slug: mapping.manifestSubcategorySlug ?? "",
      final_main_category_slug: mapping.mainSlug,
      final_subcategory_slug: mapping.subcategorySlug ?? "",
      notes: mapping.notes.join(" "),
    });

    if (!mapping.mainSlug) {
      errors.push(`${context}: main category is required.`);
    }

    const normalized = {
      ...row,
      finalSlug,
      sortOrder,
      isActive: parseBoolean(row.is_active, context, errors),
      galleryImages,
      categoryMapping: mapping,
    };

    normalizedProducts.push(normalized);
    slugReport.push({
      product_code: row.product_code,
      manifest_slug: row.slug,
      final_slug: finalSlug,
      changed: row.slug !== finalSlug,
      record_type: row.record_type,
    });
  }

  for (const row of inventoryRows) {
    if (!manifestImageRefs.has(row.image_url)) {
      errors.push(`Inventory image is not referenced by manifest: ${row.image_url}`);
    }
  }

  return {
    errors,
    warnings,
    recordCounts,
    normalizedProducts,
    slugReport,
    categoryMappings,
  };
}

async function loadDatabaseState(supabase) {
  const [
    { data: categories, error: categoryError },
    { data: products, error: productError },
  ] = await Promise.all([
    supabase
      .from("product_categories")
      .select("id,name,slug,parent_id,description,image_url,icon,sort_order,is_active,created_at,updated_at")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("id,name,slug,product_code,category_id,subcategory_id,is_active"),
  ]);

  if (categoryError) {
    fail(`Could not load product_categories: ${categoryError.message}`);
  }

  if (productError) {
    fail(`Could not load products: ${productError.message}`);
  }

  return { categories: categories ?? [], products: products ?? [] };
}

function validateAgainstDatabase(normalizedProducts, databaseState) {
  const errors = [];
  const productsByCode = new Map(
    databaseState.products
      .filter((product) => product.product_code)
      .map((product) => [product.product_code, product]),
  );
  const productsBySlug = new Map(databaseState.products.map((product) => [product.slug, product]));

  for (const product of normalizedProducts) {
    const existingByCode = productsByCode.get(product.product_code);
    const existingBySlug = productsBySlug.get(product.finalSlug);

    if (product.record_type === "existing_product_update") {
      if (!existingByCode) {
        errors.push(`${product.product_code}: expected existing product, but no matching product_code exists.`);
      }

      continue;
    }

    if (existingByCode && existingByCode.slug !== product.finalSlug) {
      errors.push(
        `${product.product_code}: product_code already exists with slug "${existingByCode.slug}", expected "${product.finalSlug}".`,
      );
    }

    if (existingBySlug && existingBySlug.product_code !== product.product_code) {
      errors.push(
        `${product.product_code}: final slug "${product.finalSlug}" already belongs to product_code "${existingBySlug.product_code}".`,
      );
    }
  }

  return errors;
}

function getRequiredCategories(normalizedProducts) {
  const bySlug = new Map();

  for (const product of normalizedProducts) {
    const mapping = product.categoryMapping;
    bySlug.set(mapping.mainSlug, {
      slug: mapping.mainSlug,
      name: mapping.mainCategoryName,
      parentSlug: catalogueRootSlug,
      isMain: true,
    });

    if (mapping.subcategorySlug) {
      bySlug.set(mapping.subcategorySlug, {
        slug: mapping.subcategorySlug,
        name: mapping.subcategoryName,
        parentSlug: mapping.mainSlug,
        isMain: false,
      });
    }
  }

  return Array.from(bySlug.values());
}

async function ensureCategories(supabase, normalizedProducts, dryRun) {
  const actions = [];
  let { categories } = await loadDatabaseState(supabase);
  let bySlug = new Map(categories.map((category) => [category.slug, category]));
  const root = bySlug.get(catalogueRootSlug);

  if (!root) {
    fail(`Catalogue root category "${catalogueRootSlug}" does not exist.`);
  }

  const required = getRequiredCategories(normalizedProducts);
  const mainCategories = required.filter((category) => category.isMain);
  const subcategories = required.filter((category) => !category.isMain);

  async function refreshCategories() {
    const state = await loadDatabaseState(supabase);
    categories = state.categories;
    bySlug = new Map(categories.map((category) => [category.slug, category]));
  }

  async function ensureCategory(category) {
    const parent = bySlug.get(category.parentSlug);

    if (!parent) {
      fail(`Missing parent category "${category.parentSlug}" for "${category.slug}".`);
    }

    const existing = bySlug.get(category.slug);
    const siblings = categories.filter((candidate) => candidate.parent_id === parent.id);
    const nextSortOrder =
      siblings.length === 0
        ? 10
        : Math.max(...siblings.map((candidate) => candidate.sort_order ?? 0)) + 10;

    if (!existing) {
      actions.push(`create category ${category.parentSlug} > ${category.slug}`);

      if (dryRun) {
        const simulatedCategory = {
          id: `dry-run:${category.slug}`,
          name: category.name,
          slug: category.slug,
          parent_id: parent.id,
          description: null,
          image_url: null,
          icon: null,
          sort_order: nextSortOrder,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        categories = [...categories, simulatedCategory];
        bySlug.set(category.slug, simulatedCategory);
      } else {
        const { error } = await supabase.from("product_categories").insert({
          name: category.name,
          slug: category.slug,
          parent_id: parent.id,
          description: null,
          image_url: null,
          sort_order: nextSortOrder,
          is_active: true,
        });

        if (error) {
          fail(`Could not create category "${category.slug}": ${error.message}`);
        }

        await refreshCategories();
      }

      return;
    }

    const needsUpdate =
      existing.parent_id !== parent.id ||
      existing.name !== category.name ||
      existing.is_active !== true;

    if (needsUpdate) {
      actions.push(`update category ${category.slug} under ${category.parentSlug}`);

      if (dryRun) {
        const simulatedCategory = {
          ...existing,
          name: category.name,
          parent_id: parent.id,
          is_active: true,
        };
        categories = categories.map((candidate) =>
          candidate.id === existing.id ? simulatedCategory : candidate,
        );
        bySlug.set(category.slug, simulatedCategory);
      } else {
        const { error } = await supabase
          .from("product_categories")
          .update({
            name: category.name,
            parent_id: parent.id,
            is_active: true,
          })
          .eq("id", existing.id);

        if (error) {
          fail(`Could not update category "${category.slug}": ${error.message}`);
        }

        await refreshCategories();
      }
    }
  }

  for (const category of mainCategories) {
    await ensureCategory(category);
  }

  if (!dryRun) {
    await refreshCategories();
  }

  for (const category of subcategories) {
    await ensureCategory(category);
  }

  return {
    actions,
    categories,
  };
}

function buildProductPayload(product, categoriesBySlug, existingProduct = null) {
  const mainCategory = categoriesBySlug.get(product.categoryMapping.mainSlug);
  const subcategory = product.categoryMapping.subcategorySlug
    ? categoriesBySlug.get(product.categoryMapping.subcategorySlug)
    : null;

  if (!mainCategory) {
    fail(`${product.product_code}: missing resolved main category ${product.categoryMapping.mainSlug}.`);
  }

  if (product.categoryMapping.subcategorySlug && !subcategory) {
    fail(`${product.product_code}: missing resolved subcategory ${product.categoryMapping.subcategorySlug}.`);
  }

  return {
    name: product.product_name,
    slug:
      product.record_type === "existing_product_update" && existingProduct
        ? existingProduct.slug
        : product.finalSlug,
    category_id: mainCategory.id,
    subcategory_id: subcategory?.id ?? null,
    short_description: getProductShortDescription(product),
    description: getProductDescription(product),
    product_code: product.product_code,
    material: product.material || null,
    set_contents: null,
    pieces: null,
    available_colors: getStringList(product.colour),
    features: getFeatureList(product),
    tags: getTagList(product, product.categoryMapping),
    image_url: product.image_url,
    gallery_images: product.galleryImages
      .filter((imageUrl) => imageUrl !== product.image_url)
      .map((imageUrl, index) => ({
        url: imageUrl,
        alt: `${product.product_name} alternate view ${index + 1}`,
      })),
    is_featured: false,
    is_active: product.isActive,
    sort_order: product.sortOrder,
  };
}

async function syncProductImages(supabase, productId, product) {
  const desiredUrls = product.galleryImages;
  const desiredUrlSet = new Set(desiredUrls);
  const { data: currentImages, error: currentImagesError } = await supabase
    .from("product_images")
    .select("id,image_url")
    .eq("product_id", productId);

  if (currentImagesError) {
    fail(`${product.product_code}: could not load current product images: ${currentImagesError.message}`);
  }

  const removeIds = (currentImages ?? [])
    .filter((image) => !desiredUrlSet.has(image.image_url))
    .map((image) => image.id);

  if (removeIds.length > 0) {
    const { error } = await supabase
      .from("product_images")
      .delete()
      .in("id", removeIds);

    if (error) {
      fail(`${product.product_code}: could not remove stale product images: ${error.message}`);
    }
  }

  const { error: resetError } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  if (resetError) {
    fail(`${product.product_code}: could not reset primary image: ${resetError.message}`);
  }

  for (const [index, imageUrl] of desiredUrls.entries()) {
    const { error } = await supabase.from("product_images").upsert(
      {
        product_id: productId,
        image_url: imageUrl,
        alt_text:
          index === 0
            ? `${product.product_name} by Hira Industries`
            : `${product.product_name} alternate view ${index}`,
        is_primary: false,
        sort_order: index,
      },
      { onConflict: "product_id,image_url" },
    );

    if (error) {
      fail(`${product.product_code}: could not upsert product image ${imageUrl}: ${error.message}`);
    }
  }

  const { error: primaryError } = await supabase
    .from("product_images")
    .update({ is_primary: true, sort_order: 0 })
    .eq("product_id", productId)
    .eq("image_url", product.image_url);

  if (primaryError) {
    fail(`${product.product_code}: could not set primary image: ${primaryError.message}`);
  }
}

async function upsertProducts(supabase, normalizedProducts, categories, dryRun) {
  const actions = [];
  const productsState = await loadDatabaseState(supabase);
  const productsByCode = new Map(
    productsState.products
      .filter((product) => product.product_code)
      .map((product) => [product.product_code, product]),
  );
  const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));

  for (const product of normalizedProducts) {
    const existingProduct = productsByCode.get(product.product_code) ?? null;
    const payload = buildProductPayload(product, categoriesBySlug, existingProduct);
    const action = existingProduct ? "update" : "insert";
    actions.push(`${action} product ${product.product_code} ${payload.slug}`);

    if (dryRun) {
      continue;
    }

    let productId = existingProduct?.id;

    if (existingProduct) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", existingProduct.id);

      if (error) {
        fail(`${product.product_code}: could not update product: ${error.message}`);
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        fail(`${product.product_code}: could not insert product: ${error.message}`);
      }

      productId = data.id;
    }

    await syncProductImages(supabase, productId, product);
  }

  return actions;
}

function writeCsv(filePath, rows, headers) {
  const escapeCsv = (value) => {
    const stringValue = String(value ?? "");
    return /[",\n]/.test(stringValue)
      ? `"${stringValue.replace(/"/g, '""')}"`
      : stringValue;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")),
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

function writeReports({
  mode,
  packageDir,
  validation,
  databaseErrors,
  categoryActions,
  productActions,
}) {
  fs.mkdirSync(reportDir, { recursive: true });
  writeCsv(
    path.join(reportDir, "slug-normalization.csv"),
    validation.slugReport,
    ["product_code", "record_type", "manifest_slug", "final_slug", "changed"],
  );
  writeCsv(
    path.join(reportDir, "category-mapping.csv"),
    validation.categoryMappings,
    [
      "product_code",
      "manifest_main_category_slug",
      "manifest_subcategory_slug",
      "final_main_category_slug",
      "final_subcategory_slug",
      "notes",
    ],
  );

  const summary = {
    mode,
    packageDir,
    recordCounts: validation.recordCounts,
    validationErrors: validation.errors,
    databaseErrors,
    categoryActionCount: categoryActions.length,
    productActionCount: productActions.length,
    categoryActions,
    productActions,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(reportDir, "summary.json"),
    JSON.stringify(summary, null, 2),
  );

  const markdown = [
    "# Product Import Batches 1-8",
    "",
    `Mode: ${mode}`,
    `Package: ${packageDir}`,
    `Generated: ${summary.generatedAt}`,
    "",
    "## Counts",
    `- New products: ${validation.recordCounts.new_product ?? 0}`,
    `- Existing product updates: ${validation.recordCounts.existing_product_update ?? 0}`,
    `- Category actions: ${categoryActions.length}`,
    `- Product actions: ${productActions.length}`,
    "",
    "## Validation",
    validation.errors.length === 0 && databaseErrors.length === 0
      ? "- No blocking validation errors."
      : [...validation.errors, ...databaseErrors].map((error) => `- ${error}`).join("\n"),
    "",
    "## Category Mapping",
    "- See category-mapping.csv.",
    "",
    "## Slug Normalization",
    "- See slug-normalization.csv.",
    "",
  ];

  fs.writeFileSync(path.join(reportDir, "import-report.md"), `${markdown.join("\n")}\n`);
}

async function main() {
  if (shouldApply && args.includes("--dry-run")) {
    fail("Choose either --dry-run or --apply, not both.");
  }

  const packageDir = findPackageDir();
  const rawInput = runCsvNormalizer(packageDir);
  const validation = validatePackage(rawInput);
  const supabase = createSupabaseClient();
  const databaseState = await loadDatabaseState(supabase);
  const databaseErrors = validateAgainstDatabase(
    validation.normalizedProducts,
    databaseState,
  );

  if (validation.errors.length > 0 || databaseErrors.length > 0) {
    writeReports({
      mode: isDryRun ? "dry-run" : "apply-blocked",
      packageDir,
      validation,
      databaseErrors,
      categoryActions: [],
      productActions: [],
    });
    fail("Import validation failed. See reports/product-import-batches-1-8/summary.json.", [
      ...validation.errors,
      ...databaseErrors,
    ]);
  }

  const { actions: categoryActions, categories } = await ensureCategories(
    supabase,
    validation.normalizedProducts,
    isDryRun,
  );
  const productActions = await upsertProducts(
    supabase,
    validation.normalizedProducts,
    categories,
    isDryRun,
  );

  writeReports({
    mode: isDryRun ? "dry-run" : "apply",
    packageDir,
    validation,
    databaseErrors,
    categoryActions,
    productActions,
  });

  console.log(
    JSON.stringify(
      {
        mode: isDryRun ? "dry-run" : "apply",
        packageDir,
        newProducts: validation.recordCounts.new_product ?? 0,
        existingProductUpdates:
          validation.recordCounts.existing_product_update ?? 0,
        categoryActions: categoryActions.length,
        productActions: productActions.length,
        reports: path.relative(repoRoot, reportDir),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  if (Array.isArray(error.details) && error.details.length > 0) {
    for (const detail of error.details.slice(0, 50)) {
      console.error(`- ${detail}`);
    }
  }
  process.exit(1);
});
