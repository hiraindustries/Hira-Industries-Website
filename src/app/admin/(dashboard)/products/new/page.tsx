import "server-only";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdminPage } from "@/lib/admin/auth";
import { getAdminCategoryTree } from "@/lib/admin/categories";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdminPage();

  const categoryTree = await getAdminCategoryTree();

  return (
    <main className="admin-page">
      <AdminPageHeader
        eyebrow="New catalogue record"
        title="Add product"
        description="Create one product and attach every alternate or lifestyle image to its gallery."
      />
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
