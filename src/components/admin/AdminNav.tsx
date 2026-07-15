"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiGrid,
  FiHome,
  FiInbox,
  FiLayers,
  FiMenu,
  FiPackage,
  FiPlusCircle,
  FiX,
} from "react-icons/fi";
import type { IconType } from "react-icons";

type AdminNavLink = {
  href: string;
  label: string;
  icon: IconType;
  exact?: boolean;
};

type AdminNavGroup = {
  label: string;
  links: AdminNavLink[];
};

function getGroups(showCms: boolean): AdminNavGroup[] {
  return [
    {
      label: "Overview",
      links: [
        { href: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
      ],
    },
    {
      label: "Catalogue",
      links: [
        { href: "/admin/products", label: "Products", icon: FiPackage },
        {
          href: "/admin/products/new",
          label: "Add Product",
          icon: FiPlusCircle,
        },
        { href: "/admin/categories", label: "Categories", icon: FiLayers },
      ],
    },
    {
      label: "Enquiries",
      links: [
        { href: "/admin/enquiries", label: "Enquiries", icon: FiInbox },
      ],
    },
    ...(showCms
      ? [
          {
            label: "Website",
            links: [
              {
                href: "/admin/content/homepage",
                label: "Homepage",
                icon: FiHome,
              },
            ],
          },
        ]
      : []),
  ];
}

export default function AdminNav({ showCms }: { showCms: boolean }) {
  const pathname = usePathname();
  const groups = getGroups(showCms);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="admin-nav-toggle"
        aria-expanded={open}
        aria-controls="admin-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        {open ? "Close menu" : "Menu"}
      </button>
      <nav
        className={`admin-nav ${open ? "is-open" : ""}`}
        id="admin-navigation"
        aria-label="Admin navigation"
      >
        {groups.map((group) => (
          <div className="admin-nav__group" key={group.label}>
            <span>{group.label}</span>
            {group.links.map((link) => {
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
                  onClick={() => setOpen(false)}
                >
                  <Icon aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}
