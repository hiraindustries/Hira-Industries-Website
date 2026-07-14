import "server-only";

import HomepageEditor from "@/components/admin/HomepageEditor";
import AdminSetupState from "@/components/admin/AdminSetupState";
import { getAdminCategoryTree } from "@/lib/admin/categories";
import { getAdminProducts } from "@/lib/admin/products";
import { getCmsAvailability } from "@/lib/cms/availability";
import { getHomepageEditorData } from "@/lib/cms/homepage-service";

export const dynamic = "force-dynamic";

export default async function AdminHomepageContentPage() {
  const availability = await getCmsAvailability();

  if (availability.status !== "ready") {
    return (
      <AdminSetupState
        eyebrow="Homepage CMS"
        title={availability.message}
        message="Apply and validate the Website CMS migration in staging before enabling homepage editing."
        missingObjects={availability.missingObjects}
      />
    );
  }

  const [editorData, categoryTree, products] = await Promise.all([
    getHomepageEditorData(),
    getAdminCategoryTree(),
    getAdminProducts(),
  ]);

  return (
    <main className="admin-page">
      <HomepageEditor
        initialContent={editorData.currentContent}
        draft={editorData.draft}
        published={editorData.published}
        versions={editorData.versions}
        products={products.filter((product) => product.is_active)}
        categories={categoryTree.mainCategories.filter(
          (category) => category.is_active,
        )}
      />
    </main>
  );
}
