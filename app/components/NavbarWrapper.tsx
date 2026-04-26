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
      <main className={`flex-1 relative min-h-screen bg-slate-50 overflow-hidden font-sans ${!isPublicRoute ? "lg:ml-[280px]" : ""}`}>
        {/* Global Premium Ambient Background Glows */}
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none animate-pulse -z-10"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none animate-pulse -z-10" style={{ animationDelay: "2s" }}></div>
        <div className="relative z-10 w-full h-full">
            {children}
        </div>
      </main>
    </div>
  );
}
