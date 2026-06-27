import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiDroplet,
  FiLayers,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import { manufacturingSteps } from "@/lib/site-data";

export const metadata = {
  title: "Manufacturing",
};

const iconMap = {
  material: FiLayers,
  finish: FiDroplet,
  quality: FiShield,
  packaging: FiPackage,
};

export default function ManufacturingPage() {
  return (
    <main className="light-page">
      <section className="internal-hero">
        <div className="light-shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Manufacturing</span>
          </nav>
          <div className="internal-hero__content">
            <div className="light-kicker">Our Process</div>
            <h1>How we craft excellence</h1>
            <p>
              A repeatable ceramic manufacturing process built around material
              consistency, careful finishing, quality checks, and safe packing.
            </p>
          </div>
        </div>
      </section>

      <section className="internal-section">
        <div className="light-shell internal-split">
          <div className="internal-image internal-image--portrait">
            <Image
              src="/images/build-pic-1.png"
              alt="Premium ceramic dinnerware representing Hira Industries manufacturing"
              fill
              loading="eager"
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div>
            <div className="light-kicker">Manufacturing Discipline</div>
            <h2 className="internal-title">
              Reliable production for retail, hospitality, and bulk buyers
            </h2>
            <p className="internal-copy">
              Every order begins with a clear product requirement and moves
              through controlled forming, glazing, firing, inspection, and
              packaging stages. This structure helps buyers source coordinated
              collections with consistent visual standards.
            </p>
            <p className="internal-copy">
              Our team supports category planning, mixed collection enquiries,
              repeat-order communication, and packaging requirements for
              professional buyers.
            </p>
            <Link
              href="/contact?intent=manufacturing"
              className="light-button light-button--gold internal-button"
            >
              Discuss a Manufacturing Requirement
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--cream">
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Four Stages</div>
            <h2 className="light-title">A clear path from material to dispatch</h2>
            <div className="light-rule" aria-hidden="true" />
          </div>

          <div className="internal-process-grid">
            {manufacturingSteps.map((item) => {
              const Icon = iconMap[item.icon];

              return (
                <article key={item.step} className="internal-process-card">
                  <span aria-hidden="true">
                    <Icon />
                  </span>
                  <small>{item.step}</small>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
