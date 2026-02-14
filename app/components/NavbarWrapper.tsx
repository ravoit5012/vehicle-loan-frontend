// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "./Navbar";

// const HIDE_NAVBAR_ROUTES = ["/", "/login"];

// export default function NavbarWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const hideNavbar = HIDE_NAVBAR_ROUTES.includes(pathname);

//   return (
//     <div className="flex flex-col">
//       {!hideNavbar && <Navbar />}

//       <main className={`flex-1 ${hideNavbar ? "" : "lg:ml-72"}`}>
//         {children}
//       </main>
//     </div>
//   );
// }


"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";
import ProtectedPageMessage from "./ProtectedPageMessage";

const PUBLIC_ROUTES = ["/", "/login"];

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (loading) return null;

  // ✅ Only protect non-public routes
  if (!user && !isPublicRoute) {
    return <ProtectedPageMessage redirectTo="/login" seconds={3} />;
  }

  return (
    <div className="flex flex-col">
      {!isPublicRoute && <Navbar />}
      <main className={`flex-1 ${!isPublicRoute ? "lg:ml-72" : ""}`}>
        {children}
      </main>
    </div>
  );
}
