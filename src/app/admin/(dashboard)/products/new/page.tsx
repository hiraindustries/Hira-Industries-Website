import "server-only";

import ProductForm from "@/components/admin/ProductForm";
import { requireAdminPage } from "@/lib/admin/auth";
import { getAdminCategoryTree } from "@/lib/admin/categories";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdminPage();

  const categoryTree = await getAdminCategoryTree();

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">New catalogue record</span>
          <h1>Add product</h1>
          <p>
            Create one product and attach every alternate or lifestyle
            image to its gallery.
          </p>
        </div>
      </header>
      <ProductForm
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
