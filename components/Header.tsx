"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/bazi", label: "八字" },
  { href: "/divination", label: "六爻" },
  { href: "/liunian", label: "流年" },
  { href: "/history", label: "记录" },
  { href: "/about", label: "关于" }
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-brass-300/10 bg-ink-950/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="玄爻阁首页">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-cinnabar-400/45 bg-cinnabar-500/12 font-serif text-lg text-cinnabar-400">
            爻
          </span>
          <span className="font-serif text-base font-medium tracking-wide text-rice-50">玄爻阁</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 overflow-x-auto rounded-md border border-brass-300/10 bg-ink-850/60 p-1 sm:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-gold-400/15 text-gold-300"
                    : "text-rice-100/60 hover:bg-rice-50/[0.06] hover:text-rice-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
        >
          <span className="block h-0.5 w-5 bg-rice-100/60" />
          <span className="mt-1 block h-0.5 w-5 bg-rice-100/60" />
          <span className="mt-1 block h-0.5 w-5 bg-rice-100/60" />
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-brass-300/10 bg-ink-900 px-4 py-3 sm:hidden">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-gold-400/15 text-gold-300"
                      : "text-rice-100/60 hover:text-rice-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
