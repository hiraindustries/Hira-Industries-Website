import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { requireAdminPage } from "@/lib/admin/auth";
import {
  getAdminCategoryById,
  getAdminCategoryTree,
} from "@/lib/admin/categories";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const [categoryTree, category] = await Promise.all([
    getAdminCategoryTree(),
    getAdminCategoryById(id),
  ]);

  if (!category || category.id === categoryTree.root?.id) {
    notFound();
  }

  const parentOptions = [
    ...(categoryTree.root ? [categoryTree.root] : []),
    ...categoryTree.mainCategories,
  ];

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Edit hierarchy record</span>
          <h1>{category.name}</h1>
          <p>Update category content, image, order, and visibility.</p>
        </div>
      </header>
      <CategoryForm
        category={category}
        parentOptions={parentOptions}
      />
    </main>
  );
}
