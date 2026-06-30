import Image from "next/image";
import { redirect } from "next/navigation";
import { FiShield } from "react-icons/fi";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminIdentity } from "@/lib/admin/auth";

export default async function AdminLoginPage() {
  if (await getAdminIdentity()) {
    redirect("/admin");
  }

  return (
    <main className="admin-login">
      <section className="admin-login__card">
        <div className="admin-login__brand">
          <Image
            src="/images/Hira-Logo.png"
            alt="Hira Industries"
            width={78}
            height={78}
            priority
          />
          <span>Hira Industries</span>
        </div>
        <span className="admin-login__eyebrow">
          <FiShield aria-hidden="true" /> Secure product CMS
        </span>
        <h1>Admin sign in</h1>
        <p>
          Manage catalogue products, category hierarchy, and product
          galleries from one protected dashboard.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
