import CategoryForm from "@/components/admin/CategoryForm";
import { getAdminCategoryTree } from "@/lib/admin/categories";

export default async function NewCategoryPage() {
  const categoryTree = await getAdminCategoryTree();
  const parentOptions = [
    ...(categoryTree.root ? [categoryTree.root] : []),
    ...categoryTree.mainCategories,
  ];

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">New hierarchy record</span>
          <h1>Add category</h1>
          <p>Create a main category or subcategory for the catalogue.</p>
        </div>
      </header>
      <CategoryForm parentOptions={parentOptions} />
    </main>
  );
}
