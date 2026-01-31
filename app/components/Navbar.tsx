"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  UserCog,
  User,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

/* ================= TYPES ================= */

type Role = "ADMIN" | "MANAGER" | "AGENT";

type MenuItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  roles?: Role[];
};

/* ================= MENU CONFIG ================= */

const menu: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
    roles: ["ADMIN", "MANAGER", "AGENT"],
  },
  {
    label: "Customer Management",
    icon: <Users size={18} />,
    roles: ["ADMIN", "MANAGER", "AGENT"],
    children: [
      { label: "Add New Customer", href: "/customers/add" },
      { label: "View Customers", href: "/customers" },
    ],
  },
  {
    label: "Loan Management",
    icon: <CreditCard size={18} />,
    roles: ["ADMIN", "MANAGER", "AGENT"],
    children: [
      { label: "Apply Loan", href: "/loans/apply" },
      { label: "Pending Loans", href: "/loans/pending" },
      { label: "Approved Loans", href: "/loans/approved" },
      { label: "Rejected Loans", href: "/loans/rejected" },
      { label: "All Loans", href: "/loans/view" },
      { label: "Loan Type", href: "/loans/types" },
      { label: "Collect Fees", href: "/loans/fees/collect" },
      { label: "Fees History", href: "/loans/fees/history" },
    ],
  },
  {
    label: "EMI Repayment Management",
    icon: <Wallet size={18} />,
    roles: ["ADMIN", "MANAGER"],
    children: [
      { label: "Add Repayment", href: "/repayments/add" },
      { label: "All Repayments", href: "/repayments" },
      { label: "Repayment Schedule", href: "/repayments/schedule" },
    ],
  },
  {
    label: "Manager Management",
    icon: <UserCog size={18} />,
    roles: ["ADMIN"],
    children: [
      { label: "Add Manager", href: "/managers/add" },
      { label: "View Managers", href: "/managers" },
      { label: "Manager Analytics", href: "/managers/analytics" },
    ],
  },
  {
    label: "Agent Management",
    icon: <User size={18} />,
    roles: ["ADMIN", "MANAGER"],
    children: [
      { label: "Add Agents", href: "/agents/add" },
      { label: "All Agents", href: "/agents" },
      { label: "Agent Analytics", href: "/agents/analytics" },
    ],
  },
  {
    label: "Reports",
    icon: <BarChart3 size={18} />,
    roles: ["ADMIN", "MANAGER"],
    children: [
      { label: "Loan Reports", href: "/reports/loans" },
      { label: "Customer Reports", href: "/reports/customers" },
      { label: "Collection Reports", href: "/reports/collections" },
      { label: "Profits", href: "/reports/profits" },
    ],
  },
  {
    label: "Settings",
    icon: <Settings size={18} />,
    roles: ["ADMIN"],
    children: [
      { label: "General Settings", href: "/settings/general" },
      { label: "Backup and Restore", href: "/settings/backup" },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  /* ===== Routes where navbar should be hidden ===== */
  const HIDE_NAVBAR_ROUTES = ["/login", "/register", "/forgot-password"];
  const shouldHideNavbar = HIDE_NAVBAR_ROUTES.includes(pathname);

  /* ===== Auto expand menu based on route ===== */
  useEffect(() => {
    const parent = menu.find((item) =>
      item.children?.some((child) =>
        pathname.startsWith(child.href!)
      )
    );
    setExpanded(parent?.label ?? null);
  }, [pathname]);

  /* ===== Filter menu by role ===== */
  const filteredMenu = menu.filter((item) => {
    if (!item.roles) return true;
    if (!user?.role) return false;
    return item.roles.includes(user.role as Role);
  });

  /* ===== Logout handler ===== */
  const handleLogout = async () => {
    await logout();          // your useAuth logout
    router.push("/login");   // optional redirect
  };

  /* ===== Hide navbar AFTER hooks ===== */
  if (shouldHideNavbar) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-white">
        <span className="font-bold">{user?.role} PANEL</span>
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <span className="text-lg font-bold tracking-wide">
            {user?.role} PANEL
          </span>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2 overflow-y-auto cursor-pointer h-[calc(100vh-72px)]">
          {filteredMenu.map((item) => {
            const isActive =
              item.href === pathname ||
              item.children?.some((c) =>
                pathname.startsWith(c.href!)
              );

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="h-9 w-9 flex items-center justify-center cursor-pointer rounded-lg bg-gray-100">
                    {item.icon}
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            }

            return (
              <div key={item.label}>
                <button
                  onClick={() =>
                    setExpanded(
                      expanded === item.label ? null : item.label
                    )
                  }
                  className={`w-full flex items-center justify-between cursor-pointer px-4 py-3 rounded-xl transition
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center cursor-pointer gap-4">
                    <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-100">
                      {item.icon}
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`transition-transform ${
                      expanded === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expanded === item.label && (
                  <div className="mt-2 ml-6 p-2 rounded-xl bg-gray-50 space-y-1">
                    {item.children.map((child) => {
                      const active = pathname === child.href;
                      return (
                        <Link
                          key={child.label}
                          href={child.href!}
                          onClick={() => setOpen(false)}
                          className={`relative block px-4 py-2 rounded-lg transition
                          ${
                            active
                              ? "bg-white text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-white"
                          }`}
                        >
                          {active && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-500 rounded" />
                          )}
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-4 px-4 py-3 cursor-pointer text-red-600 hover:bg-red-50 rounded-xl w-full"
          >
            <div className="h-9 w-9 flex items-center justify-center cursor-pointer rounded-lg bg-red-100">
              <LogOut size={18} />
            </div>
            <span className="font-semibold">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
