import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminCategoryTree } from "@/lib/admin/categories";
import { getAdminProductById } from "@/lib/admin/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categoryTree, product] = await Promise.all([
    getAdminCategoryTree(),
    getAdminProductById(id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Edit catalogue record</span>
          <h1>{product.name}</h1>
          <p>
            Update specifications, visibility, and gallery images.
          </p>
        </div>
      </header>
      <ProductForm
        product={product}
        mainCategories={categoryTree.mainCategories.filter(
          (category) => category.is_active,
        )}
        subcategories={categoryTree.subcategories.filter(
          (category) => category.is_active,
        )}
      />
    </main>
  );
}
