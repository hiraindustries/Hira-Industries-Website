"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiLayers,
  FiPackage,
  FiPlusCircle,
} from "react-icons/fi";

const links = [
  { href: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  {
    href: "/admin/products",
    label: "Products",
    icon: FiPackage,
  },
  {
    href: "/admin/products/new",
    label: "Add Product",
    icon: FiPlusCircle,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: FiLayers,
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href ||
            (pathname.startsWith(`${link.href}/`) &&
              link.href !== "/admin/products");
        const Icon = link.icon;

        return (
          <Link
            href={link.href}
            key={link.href}
            className={active ? "is-active" : undefined}
          >
            <Icon aria-hidden="true" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
