import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiDroplet,
  FiLayers,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import { manufacturingSteps, qualityPromises } from "@/lib/site-data";

export const metadata = {
  title: "Quality Standards",
};

const iconMap = {
  material: FiLayers,
  finish: FiDroplet,
  quality: FiShield,
  packaging: FiPackage,
};

export default function QualityPage() {
  return (
    <main className="light-page">
      <section className="internal-hero">
        <div className="light-shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Quality</span>
          </nav>
          <div className="internal-hero__content">
            <div className="light-kicker">Our Promise</div>
            <h1>Quality you can trust in every collection</h1>
            <p>
              Consistent materials, careful finishing, practical inspection,
              and buyer-ready packaging guide every Hira Industries order.
            </p>
          </div>
        </div>
      </section>

      <section className="internal-section">
        <div className="light-shell internal-split">
          <div>
            <div className="light-kicker">Quality Standards</div>
            <h2 className="internal-title">
              Designed for premium presentation and everyday durability
            </h2>
            <p className="internal-copy">
              Our ceramic collections are finished for visual appeal, reliable
              use, and buyer-ready presentation. Each stage is reviewed to keep
              form, glaze, balance, and packing clear and consistent.
            </p>
            <ul className="internal-checks">
              <li>Materials selected for stable production and clean firing.</li>
              <li>Surface, edge, and glaze checks before final packing.</li>
              <li>Practical durability for home and hospitality service.</li>
              <li>Layered packaging prepared for trade handling and dispatch.</li>
            </ul>
          </div>

          <div className="internal-image">
            <Image
              src="/images/build-pic-2.png"
              alt="White ceramic serveware with refined gold detailing"
              fill
              loading="eager"
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
        </div>
      </section>

      <section className="internal-section internal-section--cream">
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Core Checks</div>
            <h2 className="light-title">Four commitments behind every order</h2>
            <div className="light-rule" aria-hidden="true" />
          </div>

          <div className="promise-grid">
            {qualityPromises.map((item) => {
              const Icon = iconMap[item.icon];

              return (
                <article key={item.title} className="promise-card">
                  <span className="promise-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="internal-section">
        <div className="light-shell">
          <div className="light-heading">
            <div className="light-kicker">Controlled Process</div>
            <h2 className="light-title">From material to safe dispatch</h2>
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

          <div className="home-section__action">
            <Link
              href="/contact?intent=quality-details"
              className="light-button light-button--gold"
            >
              Request Quality Details
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
