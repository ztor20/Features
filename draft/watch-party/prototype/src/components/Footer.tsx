"use client";

// Trimmed from the crowdfund proto's Footer — EN-only.
export function Footer() {
  return (
    <footer className="border-t border-line bg-bg px-4 sm:px-8 py-8 sm:py-10 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-semibold mb-3">Contact us</div>
          <div className="text-muted">enquiry@ztor.com</div>
        </div>
        <div>
          <div className="font-semibold mb-3">Support</div>
          <div className="text-muted space-y-1">
            <div>FAQ</div>
            <div>How watch parties work</div>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="font-semibold text-xl">
            ztor<span className="text-accent">.</span>
            <span className="text-xs ml-1 align-top text-muted">WATCH PARTY</span>
          </div>
          <div className="text-xs text-muted mt-3">
            copyright © 2026 Ztor. All Rights Reserved
          </div>
          <div className="text-xs text-muted mt-2 max-w-xs md:text-right">
            Internal demo. Sample clips are shown for demonstration only.
          </div>
        </div>
      </div>
    </footer>
  );
}
