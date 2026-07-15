import "server-only";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoryForm from "@/components/admin/CategoryForm";
import { requireAdminPage } from "@/lib/admin/auth";
import { getAdminCategoryTree } from "@/lib/admin/categories";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  await requireAdminPage();

  const categoryTree = await getAdminCategoryTree();
  const parentOptions = [
    ...(categoryTree.root ? [categoryTree.root] : []),
    ...categoryTree.mainCategories,
  ];

  return (
    <main className="admin-page">
      <AdminPageHeader
        eyebrow="New hierarchy record"
        title="Add category"
        description="Create a main category or subcategory for the catalogue."
      />
      <CategoryForm parentOptions={parentOptions} />
    </main>
  );
}
