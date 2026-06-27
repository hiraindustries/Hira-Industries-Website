import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiLayers,
  FiUsers,
} from "react-icons/fi";
import { companyMilestones } from "@/lib/site-data";

export const metadata = {
  title: "About Hira Industries",
};

const companyPillars = [
  {
    title: "Manufacturing Focus",
    text: "Ceramic collections developed around repeatable quality, reliable production, and clean finishing.",
    icon: FiLayers,
  },
  {
    title: "Buyer Support",
    text: "Clear category guidance, catalogue support, and practical communication for every enquiry.",
    icon: FiUsers,
  },
  {
    title: "Quality Discipline",
    text: "Material, glazing, firing, and final presentation checks are built into the process.",
    icon: FiCheckCircle,
  },
  {
    title: "Trade Ready",
    text: "Collections and packaging planned for hospitality, retail, wholesale, and export requirements.",
    icon: FiGlobe,
  },
];

export default function CompanyPage() {
  return (
    <main className="light-page">
      <section className="internal-hero">
        <div className="light-shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About</span>
          </nav>
          <div className="internal-hero__content">
            <div className="light-kicker">About Hira Industries</div>
            <h1>Crafting dependable ceramic collections since 1995</h1>
            <p>
              A Khurja-based ceramic crockery manufacturer serving homes,
              hospitality teams, retailers, wholesalers, and international
              buyers.
            </p>
          </div>
        </div>
      </section>

      <section className="internal-section">
        <div className="light-shell internal-split">
          <div>
            <div className="light-kicker">Our Company</div>
            <h2 className="internal-title">
              Premium presentation backed by practical manufacturing
            </h2>
            <p className="internal-copy">
              Hira Industries develops ceramic dinnerware, tea and coffee sets,
              mugs, cups, plates, bowls, and professional hospitality
              collections. Our work combines traditional ceramic expertise with
              the clear service standards modern buyers expect.
            </p>
            <p className="internal-copy">
              From first product selection to final dispatch, we focus on
              consistency, honest communication, buyer-ready packaging, and
              collections that perform well in daily use.
            </p>

            <div className="about-stats internal-stats">
              {companyMilestones.map((item) => (
                <div key={item.label} className="about-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="internal-image">
            <Image
              src="/images/build-pic-1.png"
              alt="Premium white and gold ceramic dinnerware by Hira Industries"
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
            <div className="light-kicker">What We Stand For</div>
            <h2 className="light-title">Built for long-term buyer confidence</h2>
            <div className="light-rule" aria-hidden="true" />
          </div>

          <div className="promise-grid">
            {companyPillars.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="promise-card">
                  <span className="promise-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="internal-section">
        <div className="light-shell">
          <div className="internal-cta">
            <div>
              <div className="light-kicker">Start a Conversation</div>
              <h2>Tell us what your market or project needs</h2>
              <p>
                We can help you choose categories, discuss bulk requirements,
                and request the latest product catalogue.
              </p>
            </div>
            <div className="internal-cta__actions">
              <Link
                href="/contact"
                className="light-button light-button--gold"
              >
                Contact Hira Industries
                <FiArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="/products"
                className="light-button light-button--outline"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
