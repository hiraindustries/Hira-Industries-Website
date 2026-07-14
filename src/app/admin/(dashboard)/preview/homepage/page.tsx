import "server-only";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import HomepageRenderer from "@/components/home/HomepageRenderer";
import AdminSetupState from "@/components/admin/AdminSetupState";
import { getCatalogueData } from "@/lib/catalogue";
import { getCmsAvailability } from "@/lib/cms/availability";
import {
  getHomepageDraftForPreview,
} from "@/lib/cms/homepage-service";
import { fallbackHomepageContent } from "@/lib/cms/homepage";

export const dynamic = "force-dynamic";

export default async function HomepagePreviewPage() {
  const availability = await getCmsAvailability();

  if (availability.status !== "ready") {
    return (
      <AdminSetupState
        eyebrow="Homepage Preview"
        title={availability.message}
        message="Apply and validate the Website CMS migration before previewing draft homepage content."
        missingObjects={availability.missingObjects}
      />
    );
  }

  const [catalogue, draft] = await Promise.all([
    getCatalogueData(),
    getHomepageDraftForPreview(),
  ]);

  return (
    <main className="admin-page admin-page--preview">
      <div className="admin-form__toolbar">
        <Link href="/admin/content/homepage" className="admin-text-link">
          <FiArrowLeft aria-hidden="true" /> Back to editor
        </Link>
      </div>
      <div className="admin-preview-frame">
        <HomepageRenderer
          catalogue={catalogue}
          content={draft?.content ?? fallbackHomepageContent}
          preview
        />
      </div>
    </main>
  );
}
