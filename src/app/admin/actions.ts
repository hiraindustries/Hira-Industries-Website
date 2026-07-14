"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin, isApprovedAdminEmail } from "@/lib/admin/auth";
import type { AdminActionState } from "@/lib/admin/action-state";
import { catalogueRootSlug } from "@/lib/admin/categories";
import { isContactEnquiryStatus } from "@/lib/admin/enquiries";
import { createAdminServiceClient } from "@/lib/admin/service";
import {
  removeAdminImages,
  uploadAdminImage,
} from "@/lib/admin/storage";
import { submitIndexNowUrls } from "@/lib/seo/indexnow";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import type {
  Database,
  ProductImage,
} from "@/lib/supabase/database.types";

type AdminServiceClient = Awaited<ReturnType<typeof createAdminServiceClient>>;

type ProductIndexCandidate = {
  slug: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  includeProductUrl: boolean;
};

type ExistingImageInput = {
  id: string;
  altText: string;
  sortOrder: number;
  removed: boolean;
};

type NewImageInput = {
  fileIndex: number;
  altText: string;
  sortOrder: number;
};

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, name: string) {
  return getString(formData, name) || null;
}

function getInteger(formData: FormData, name: string, fallback = 0) {
  const value = Number.parseInt(getString(formData, name), 10);
  return Number.isFinite(value) ? value : fallback;
}

function getOptionalInteger(formData: FormData, name: string) {
  const value = getString(formData, name);

  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function getStringList(formData: FormData, name: string) {
  return getString(formData, name)
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function getBoolean(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function parseJsonArray<T>(value: FormDataEntryValue | null): T[] {
  if (typeof value !== "string" || !value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function validateNameAndSlug(name: string, slug: string) {
  if (!name || !slug) {
    throw new Error("Name and slug are required.");
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "Slug can contain lowercase letters, numbers, and hyphens only.",
    );
  }
}

function formatDatabaseError(error: { message: string; code?: string }) {
  if (error.code === "23505") {
    return "The slug or product code is already in use.";
  }

  if (error.code === "23503") {
    return "The selected category or subcategory is no longer available.";
  }

  return error.message;
}

async function getProductIndexCandidate(
  supabase: AdminServiceClient,
  productId: string,
) {
  const { data, error } = await supabase
    .from("products")
    .select("slug, category_id, subcategory_id, is_active")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    console.warn("[indexnow] Could not load product URL data", {
      productId,
      message: error.message,
    });
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    slug: data.slug,
    category_id: data.category_id,
    subcategory_id: data.subcategory_id,
    includeProductUrl: data.is_active,
  } satisfies ProductIndexCandidate;
}

async function getProductCategoryIndexPaths(
  supabase: AdminServiceClient,
  candidate: ProductIndexCandidate,
) {
  const ids = [candidate.category_id, candidate.subcategory_id].filter(
    (id): id is string => Boolean(id),
  );

  if (ids.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("product_categories")
    .select("id, slug, parent_id")
    .in("id", ids);

  if (error) {
    console.warn("[indexnow] Could not load category URL data", {
      message: error.message,
    });
    return [];
  }

  const mainCategory = data?.find(
    (category) => category.id === candidate.category_id,
  );
  const subcategory = candidate.subcategory_id
    ? data?.find((category) => category.id === candidate.subcategory_id)
    : null;
  const paths: string[] = [];

  if (mainCategory?.slug) {
    paths.push(`/products?category=${mainCategory.slug}`);
  }

  if (mainCategory?.slug && subcategory?.slug) {
    paths.push(
      `/products?category=${mainCategory.slug}&subcategory=${subcategory.slug}`,
    );
  }

  return paths;
}

async function submitProductIndexNowUrls(
  supabase: AdminServiceClient,
  candidates: ProductIndexCandidate[],
) {
  const paths = new Set<string>(["/products"]);

  for (const candidate of candidates) {
    if (candidate.includeProductUrl && candidate.slug) {
      paths.add(`/products/${candidate.slug}`);
    }

    const categoryPaths = await getProductCategoryIndexPaths(
      supabase,
      candidate,
    );
    categoryPaths.forEach((path) => paths.add(path));
  }

  await submitIndexNowUrls(Array.from(paths));
}

async function validateProductCategories(
  categoryId: string,
  subcategoryId: string | null,
) {
  const supabase = await createAdminServiceClient();
  const ids = [categoryId, subcategoryId].filter(
    (id): id is string => Boolean(id),
  );
  const { data, error } = await supabase
    .from("product_categories")
    .select("id, parent_id")
    .in("id", ids);

  if (error || !data) {
    throw new Error("Could not validate the selected categories.");
  }

  const main = data.find((category) => category.id === categoryId);
  const subcategory = subcategoryId
    ? data.find((category) => category.id === subcategoryId)
    : null;

  if (!main) {
    throw new Error("Select a valid main category.");
  }

  if (subcategoryId && subcategory?.parent_id !== main.id) {
    throw new Error(
      "The selected subcategory does not belong to the main category.",
    );
  }
}

function getProductPayload(formData: FormData) {
  const name = getString(formData, "name");
  const slug = getString(formData, "slug").toLowerCase();
  const categoryId = getString(formData, "category_id");
  const subcategoryId =
    getOptionalString(formData, "subcategory_id");
  const shortDescription = getString(formData, "short_description");
  const description = getString(formData, "description");
  const intent = getString(formData, "intent");

  validateNameAndSlug(name, slug);

  if (!categoryId) {
    throw new Error("Select a main category.");
  }

  if (!shortDescription || !description) {
    throw new Error("Short description and full description are required.");
  }

  return {
    name,
    slug,
    product_code: getOptionalString(formData, "product_code"),
    category_id: categoryId,
    subcategory_id: subcategoryId,
    short_description: shortDescription,
    description,
    material: getOptionalString(formData, "material"),
    set_contents: getOptionalString(formData, "set_contents"),
    pieces: getOptionalInteger(formData, "pieces"),
    available_colors: getStringList(formData, "available_colors"),
    features: getStringList(formData, "features"),
    tags: getStringList(formData, "tags"),
    is_featured: getBoolean(formData, "is_featured"),
    is_active:
      intent === "draft" ? false : getBoolean(formData, "is_active"),
    sort_order: Math.max(0, getInteger(formData, "sort_order")),
  } satisfies Database["public"]["Tables"]["products"]["Insert"];
}

async function syncProductImages(productId: string, formData: FormData) {
  const supabase = await createAdminServiceClient();
  const existingInputs = parseJsonArray<ExistingImageInput>(
    formData.get("existing_images"),
  );
  const newInputs = parseJsonArray<NewImageInput>(
    formData.get("new_images"),
  );
  const primaryKey = getString(formData, "primary_image_key");
  const files = formData
    .getAll("product_images")
    .filter(
      (entry): entry is File =>
        typeof entry !== "string" && entry.size > 0,
    );

  const { data: currentImages, error: currentImagesError } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId);

  if (currentImagesError) {
    throw new Error(
      `Could not load existing images: ${currentImagesError.message}`,
    );
  }

  if ((currentImages ?? []).some((image) => image.is_primary)) {
    const { error } = await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    if (error) {
      throw new Error(`Could not reset the cover image: ${error.message}`);
    }
  }

  const currentById = new Map(
    (currentImages ?? []).map((image) => [image.id, image]),
  );
  const removedImages = existingInputs
    .filter((image) => image.removed && currentById.has(image.id))
    .map((image) => currentById.get(image.id) as ProductImage);
  const removedIds = removedImages.map((image) => image.id);

  if (removedIds.length > 0) {
    const { error } = await supabase
      .from("product_images")
      .delete()
      .in("id", removedIds);

    if (error) {
      throw new Error(`Could not remove images: ${error.message}`);
    }
  }

  const activeExistingInputs = existingInputs.filter(
    (image) => !image.removed && currentById.has(image.id),
  );

  for (const image of activeExistingInputs) {
    const { error } = await supabase
      .from("product_images")
      .update({
        alt_text: image.altText || null,
        sort_order: Math.max(0, image.sortOrder),
        is_primary: false,
      })
      .eq("id", image.id)
      .eq("product_id", productId);

    if (error) {
      throw new Error(`Could not update image details: ${error.message}`);
    }
  }

  const newImageIds = new Map<number, string>();

  for (const imageInput of newInputs) {
    const file = files[imageInput.fileIndex];

    if (!file) {
      continue;
    }

    const { publicUrl } = await uploadAdminImage({
      bucket: "product-images",
      folder: productId,
      file,
    });
    const { data: insertedImage, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        image_url: publicUrl,
        alt_text: imageInput.altText || null,
        sort_order: Math.max(0, imageInput.sortOrder),
        is_primary: false,
      })
      .select("id")
      .single();

    if (error) {
      await removeAdminImages("product-images", [publicUrl]);
      throw new Error(`Could not save uploaded image: ${error.message}`);
    }

    newImageIds.set(imageInput.fileIndex, insertedImage.id);
  }

  const { data: allImages, error: allImagesError } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (allImagesError) {
    throw new Error(`Could not finalize product images: ${allImagesError.message}`);
  }

  const requestedPrimaryId = primaryKey.startsWith("existing:")
    ? primaryKey.slice("existing:".length)
    : primaryKey.startsWith("new:")
      ? newImageIds.get(
          Number.parseInt(primaryKey.slice("new:".length), 10),
        )
      : undefined;
  const primaryImage =
    allImages?.find((image) => image.id === requestedPrimaryId) ??
    allImages?.[0] ??
    null;

  if (primaryImage) {
    const { error } = await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", primaryImage.id)
      .eq("product_id", productId);

    if (error) {
      throw new Error(`Could not set the cover image: ${error.message}`);
    }
  }

  const normalizedImages = (allImages ?? []).map((image) => ({
    ...image,
    is_primary: image.id === primaryImage?.id,
  }));
  const galleryImages = normalizedImages
    .filter((image) => !image.is_primary)
    .map((image) => ({
      url: image.image_url,
      alt: image.alt_text,
    }));

  const { error: legacySyncError } = await supabase
    .from("products")
    .update({
      image_url: primaryImage?.image_url ?? null,
      gallery_images: galleryImages,
    })
    .eq("id", productId);

  if (legacySyncError) {
    throw new Error(`Could not sync the product cover: ${legacySyncError.message}`);
  }

  await removeAdminImages(
    "product-images",
    removedImages.map((image) => image.image_url),
  );
}

export async function loginAdminAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Supabase Auth is not configured.",
    };
  }

  if (!email || !password) {
    return {
      status: "error",
      message: "Enter your email address and password.",
    };
  }

  if (!isApprovedAdminEmail(email)) {
    return {
      status: "error",
      message: "Invalid admin email or password.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !isApprovedAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message: "Invalid admin email or password.",
    };
  }

  redirect("/admin");
}

export async function logoutAdminAction() {
  const supabase = await createSupabaseAuthServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

export async function createProductAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await assertAdmin();
    const payload = getProductPayload(formData);
    await validateProductCategories(
      payload.category_id,
      payload.subcategory_id ?? null,
    );
    const supabase = await createAdminServiceClient();
    const { data: product, error } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      throw new Error(formatDatabaseError(error));
    }

    try {
      await syncProductImages(product.id, formData);
    } catch (error) {
      await supabase.from("products").delete().eq("id", product.id);
      throw error;
    }

    revalidatePath("/products");
    revalidatePath(`/products/${payload.slug}`);
    revalidatePath("/admin/products");
    await submitProductIndexNowUrls(supabase, [
      {
        slug: payload.slug,
        category_id: payload.category_id,
        subcategory_id: payload.subcategory_id ?? null,
        includeProductUrl: payload.is_active === true,
      },
    ]);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not create product.",
    };
  }

  redirect("/admin/products?created=1");
}

export async function updateProductAction(
  productId: string,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await assertAdmin();
    const payload = getProductPayload(formData);
    await validateProductCategories(
      payload.category_id,
      payload.subcategory_id ?? null,
    );
    const supabase = await createAdminServiceClient();
    const currentProduct = await getProductIndexCandidate(
      supabase,
      productId,
    );
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId);

    if (error) {
      throw new Error(formatDatabaseError(error));
    }

    await syncProductImages(productId, formData);
    revalidatePath("/products");
    if (currentProduct?.slug && currentProduct.slug !== payload.slug) {
      revalidatePath(`/products/${currentProduct.slug}`);
    }
    revalidatePath(`/products/${payload.slug}`);
    revalidatePath("/admin/products");
    const indexNowCandidates: ProductIndexCandidate[] = [
      {
        slug: payload.slug,
        category_id: payload.category_id,
        subcategory_id: payload.subcategory_id ?? null,
        includeProductUrl: payload.is_active === true,
      },
    ];

    if (currentProduct) {
      indexNowCandidates.unshift(currentProduct);
    }

    await submitProductIndexNowUrls(supabase, indexNowCandidates);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not update product.",
    };
  }

  redirect("/admin/products?updated=1");
}

export async function deleteProductAction(formData: FormData) {
  await assertAdmin();
  const productId = getString(formData, "product_id");
  const supabase = await createAdminServiceClient();
  const currentProduct = await getProductIndexCandidate(supabase, productId);
  const { data: images } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", productId);
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(`Could not delete product: ${error.message}`);
  }

  await removeAdminImages(
    "product-images",
    (images ?? []).map((image) => image.image_url),
  );
  revalidatePath("/products");
  if (currentProduct?.slug) {
    revalidatePath(`/products/${currentProduct.slug}`);
  }
  revalidatePath("/admin/products");
  if (currentProduct) {
    await submitProductIndexNowUrls(supabase, [
      { ...currentProduct, includeProductUrl: true },
    ]);
  }
}

export async function toggleProductActiveAction(formData: FormData) {
  await assertAdmin();
  const productId = getString(formData, "product_id");
  const nextState = getString(formData, "next_state") === "true";
  const supabase = await createAdminServiceClient();
  const currentProduct = await getProductIndexCandidate(supabase, productId);
  const { error } = await supabase
    .from("products")
    .update({ is_active: nextState })
    .eq("id", productId);

  if (error) {
    throw new Error(`Could not update product status: ${error.message}`);
  }

  revalidatePath("/products");
  if (currentProduct?.slug) {
    revalidatePath(`/products/${currentProduct.slug}`);
  }
  revalidatePath("/admin/products");
  if (currentProduct) {
    await submitProductIndexNowUrls(supabase, [
      { ...currentProduct, includeProductUrl: true },
    ]);
  }
}

export async function updateContactEnquiryStatusAction(formData: FormData) {
  await assertAdmin();
  const enquiryId = getString(formData, "enquiry_id");
  const nextStatus = getString(formData, "next_status");

  if (!enquiryId || !isContactEnquiryStatus(nextStatus)) {
    throw new Error("Select a valid enquiry status.");
  }

  const supabase = await createAdminServiceClient();
  const { error } = await supabase
    .from("contact_enquiries")
    .update({ status: nextStatus })
    .eq("id", enquiryId);

  if (error) {
    throw new Error(`Could not update enquiry status: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}

function getCategoryPayload(formData: FormData) {
  const name = getString(formData, "name");
  const slug = getString(formData, "slug").toLowerCase();

  validateNameAndSlug(name, slug);

  return {
    name,
    slug,
    parent_id: getOptionalString(formData, "parent_id"),
    description: getOptionalString(formData, "description"),
    icon: getOptionalString(formData, "icon"),
    sort_order: Math.max(0, getInteger(formData, "sort_order")),
    is_active: getBoolean(formData, "is_active"),
  };
}

async function getCategoryImage(
  formData: FormData,
  folder: string,
  currentImageUrl: string | null,
) {
  const entry = formData.get("category_image");

  if (typeof entry === "string" || !entry || entry.size === 0) {
    return getBoolean(formData, "remove_category_image")
      ? null
      : currentImageUrl;
  }

  const { publicUrl } = await uploadAdminImage({
    bucket: "category-images",
    folder,
    file: entry,
  });

  return publicUrl;
}

export async function createCategoryAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await assertAdmin();
    const payload = getCategoryPayload(formData);
    const supabase = await createAdminServiceClient();
    const { data: category, error } = await supabase
      .from("product_categories")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      throw new Error(formatDatabaseError(error));
    }

    try {
      const imageUrl = await getCategoryImage(
        formData,
        category.id,
        null,
      );

      if (imageUrl) {
        const { error: imageError } = await supabase
          .from("product_categories")
          .update({ image_url: imageUrl })
          .eq("id", category.id);

        if (imageError) {
          throw new Error(imageError.message);
        }
      }
    } catch (error) {
      await supabase
        .from("product_categories")
        .delete()
        .eq("id", category.id);
      throw error;
    }

    revalidatePath("/products");
    revalidatePath("/admin/categories");
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not create category.",
    };
  }

  redirect("/admin/categories?created=1");
}

export async function updateCategoryAction(
  categoryId: string,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await assertAdmin();
    const payload = getCategoryPayload(formData);
    const supabase = await createAdminServiceClient();
    const { data: currentCategory, error: currentError } = await supabase
      .from("product_categories")
      .select("image_url, slug")
      .eq("id", categoryId)
      .single();

    if (currentError) {
      throw new Error(currentError.message);
    }

    if (currentCategory.slug === catalogueRootSlug) {
      throw new Error("The catalogue root category cannot be edited here.");
    }

    if (payload.parent_id === categoryId) {
      throw new Error("A category cannot be its own parent.");
    }

    if (payload.parent_id) {
      const { data: parent } = await supabase
        .from("product_categories")
        .select("parent_id")
        .eq("id", payload.parent_id)
        .maybeSingle();

      if (parent?.parent_id === categoryId) {
        throw new Error("This parent selection would create a category loop.");
      }
    }

    const imageUrl = await getCategoryImage(
      formData,
      categoryId,
      currentCategory.image_url,
    );
    const { error } = await supabase
      .from("product_categories")
      .update({ ...payload, image_url: imageUrl })
      .eq("id", categoryId);

    if (error) {
      if (
        imageUrl &&
        imageUrl !== currentCategory.image_url
      ) {
        await removeAdminImages("category-images", [imageUrl]);
      }
      throw new Error(formatDatabaseError(error));
    }

    if (
      currentCategory.image_url &&
      imageUrl !== currentCategory.image_url
    ) {
      await removeAdminImages("category-images", [
        currentCategory.image_url,
      ]);
    }

    revalidatePath("/products");
    revalidatePath("/admin/categories");
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not update category.",
    };
  }

  redirect("/admin/categories?updated=1");
}
