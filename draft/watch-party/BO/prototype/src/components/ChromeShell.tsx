"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar, MobileNavDrawer } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";

// Trimmed from the crowdfund proto's ChromeShell. The /bo (back office) branch
// supplies its own admin chrome (see app/bo/layout.tsx), so we bypass the
// consumer shell entirely for those routes.
export function ChromeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close drawer on route change.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  // Back office, the BRD doc, and the biz overview own their own layout — bare.
  if (
    pathname?.startsWith("/bo") ||
    pathname?.startsWith("/brd") ||
    pathname?.startsWith("/overview")
  )
    return <>{children}</>;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
