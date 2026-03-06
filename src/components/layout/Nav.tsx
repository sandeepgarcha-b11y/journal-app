"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/journal", label: "Journal" },
  { href: "/mood", label: "Mood" },
  { href: "/review", label: "Reviews" },
  { href: "/goals", label: "Goals" },
  { href: "/affirmations", label: "Affirmations" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-cream-200 bg-cream-50/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          href="/journal"
          className="text-base font-semibold tracking-tight text-stone-800 transition-opacity hover:opacity-70"
        >
          Journal
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-cream-100 text-stone-900"
                    : "text-stone-500 hover:bg-cream-100 hover:text-stone-800"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {/* Primary CTA */}
          <Link
            href="/journal/new"
            className="ml-2 rounded-lg bg-terracotta-500 px-4 py-1.5 text-sm font-medium text-white shadow-warm-sm transition-all duration-150 hover:-translate-y-px hover:bg-terracotta-600 hover:shadow-warm active:translate-y-0"
          >
            New entry
          </Link>
        </nav>
      </div>
    </header>
  );
}
