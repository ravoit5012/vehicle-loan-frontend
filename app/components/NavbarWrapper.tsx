"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDE_NAVBAR_ROUTES = ["/", "/login"];

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = HIDE_NAVBAR_ROUTES.includes(pathname);

  return (
    <div className="flex flex-col">
      {!hideNavbar && <Navbar />}

      <main className={`flex-1 ${hideNavbar ? "" : "lg:ml-72"}`}>
        {children}
      </main>
    </div>
  );
}
