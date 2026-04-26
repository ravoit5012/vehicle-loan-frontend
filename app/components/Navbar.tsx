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
    roles: ["ADMIN", "MANAGER", "AGENT"],
    children: [
      { label: "Add Repayment", href: "/repayments/add" },
      { label: "All Repayments", href: "/repayments/all" },
      { label: "Repayment Schedule", href: "/repayments/schedule" },
    ],
  },
  {
    label: "Manager Management",
    icon: <UserCog size={18} />,
    roles: ["ADMIN"],
    children: [
      { label: "Add Manager", href: "/managers/create" },
      { label: "View Managers", href: "/managers" },
      { label: "Manager Analytics", href: "/managers/analytics" },
    ],
  },
  {
    label: "Agent Management",
    icon: <User size={18} />,
    roles: ["ADMIN", "MANAGER"],
    children: [
      { label: "Add Agents", href: "/agents/create" },
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
      { label: "Assign Access", href: "/settings/access" },
      { label: "Backup and Restore", href: "/settings/backup" },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, company } = useAuth();

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  /* ===== Routes where navbar should be hidden ===== */
  const HIDE_NAVBAR_ROUTES = ["/login", "/register", "/forgot-password", "/"];
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
  if (!user) return null; // or a loading state

  return (
    <>
      {/* Mobile Header (Glass) */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="flex items-center gap-2">
          {company?.logoUrl ? (
            <img
              src={company.logoUrl}
              alt="Logo"
              className="w-8 h-8 object-cover rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {company?.companyName?.charAt(0) || "C"}
            </div>
          )}
          <span className="font-extrabold text-slate-800 tracking-tight">{user?.role} <span className="text-indigo-600">TERMINAL</span></span>
        </div>
        <button className="p-2 rounded-lg bg-white/60 text-slate-700 hover:bg-white transition shadow-sm" onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar (Glassmorphic) */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white/80 backdrop-blur-2xl border-r border-white/40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50
        transform transition-transform duration-400 ease-out flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-50/50">
          <div className="flex items-center gap-3">
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt="Logo"
                className="w-10 h-10 object-cover rounded-xl shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[16px] font-bold shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                {company?.companyName?.charAt(0) || "C"}
              </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 tracking-tight leading-tight">
                  {user?.role}
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-widest">
                  Terminal
                </span>
            </div>
          </div>
          <button className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Menu Scroller */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide">
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
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-blue-50/50 text-indigo-700 shadow-sm border border-indigo-100/50"
                      : "text-slate-600 hover:bg-white/60 hover:shadow-sm"
                  }`}
                >
                  <div className={`h-8 w-8 flex items-center justify-center rounded-[10px] transition-colors
                      ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-indigo-600'}
                  `}>
                    {item.icon}
                  </div>
                  <span className={`text-sm ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.label}</span>
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${
                    expanded === item.label
                      ? "bg-slate-50/80 text-slate-800"
                      : isActive 
                        ? "bg-indigo-50/50 text-indigo-700"
                        : "text-slate-600 hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`h-8 w-8 flex items-center justify-center rounded-[10px] transition-colors
                        ${expanded === item.label || isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-indigo-600'}
                    `}>
                      {item.icon}
                    </div>
                    <span className={`text-sm ${expanded === item.label || isActive ? 'font-bold' : 'font-semibold'}`}>{item.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-300 ${
                      expanded === item.label ? "rotate-180 text-indigo-500" : ""
                    }`}
                  />
                </button>

                {/* Submenu Drawer */}
                <div 
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out
                    ${expanded === item.label ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                    <div className="overflow-hidden">
                      <div className="mt-1.5 mb-1.5 ml-[22px] pl-4 border-l-2 border-indigo-100/60 space-y-1 py-1">
                        {item.children.map((child) => {
                          const active = pathname === child.href;
                          return (
                            <Link
                              key={child.label}
                              href={child.href!}
                              onClick={() => setOpen(false)}
                              className={`relative block px-3 py-2 rounded-lg text-sm transition-all duration-200
                              ${
                                active
                                  ? "bg-white text-indigo-700 font-bold shadow-sm shadow-indigo-100/50 border border-indigo-50 text-[13.5px]"
                                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 text-[13.5px] font-medium"
                              }`}
                            >
                              {active && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 -ml-[19px] h-1.5 w-1.5 bg-indigo-500 rounded-full ring-4 ring-white" />
                              )}
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer Area with Logout */}
        <div className="p-4 border-t border-slate-100/50 bg-slate-50/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-[13.5px] font-bold text-slate-500 hover:text-red-600 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-red-50 hover:border-red-100 transition-all group"
          >
            <LogOut size={16} className="group-hover:scale-110 transition-transform duration-300" />
            Terminate Session
          </button>
        </div>
      </aside>
    </>
  );
}
