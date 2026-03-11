"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAction } from "@/lib/actions/auth";

const NAV_LINKS = [
  { href: "/journal",      label: "Journal"      },
  { href: "/mood",         label: "Mood"         },
  { href: "/review",       label: "Reviews"      },
  { href: "/goals",        label: "Goals"        },
  { href: "/affirmations", label: "Affirmations" },
];

export function Nav() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/login") return null;

  const linkClass = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return `rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-cream-100 text-stone-900"
        : "text-stone-500 hover:bg-cream-100 hover:text-stone-800"
    }`;
  };

  return (
    <header className="sticky top-0 z-20 border-b border-cream-200 bg-cream-50/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-stone-800 transition-opacity hover:opacity-70"
        >
          Journal
        </Link>

        {/* ── Desktop nav (md+) ─────────────────────────────────────── */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}

          {/* Separator */}
          <span className="ml-2 mr-1 h-4 w-px bg-stone-200" aria-hidden="true" />

          <form action={signOutAction}>
            <button
              type="submit"
              title="Sign out"
              aria-label="Sign out"
              className="rounded-lg p-2 text-stone-400 transition-all duration-150 hover:bg-cream-100 hover:text-stone-600"
            >
              {/* Exit / logout icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
                <polyline points="10 11 13 8 10 5" />
                <line x1="13" y1="8" x2="5" y2="8" />
              </svg>
            </button>
          </form>
        </nav>

        {/* ── Mobile: hamburger ────────────────────────────────────── */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-lg p-2 text-stone-500 transition-all duration-150 hover:bg-cream-100 hover:text-stone-800"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="3" y1="3"   x2="15" y2="15" />
                <line x1="15" y1="3"  x2="3"  y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="2" y1="4.5"  x2="16" y2="4.5"  />
                <line x1="2" y1="9"    x2="16" y2="9"    />
                <line x1="2" y1="13.5" x2="16" y2="13.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ───────────────────────────────────────────── */}
      {open && (
        <div className="border-t border-cream-200 bg-cream-50/98 px-4 pb-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-cream-100 text-stone-900"
                      : "text-stone-600 hover:bg-cream-100 hover:text-stone-800"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <div className="mt-2 border-t border-cream-200 pt-2">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-stone-400 transition-all duration-150 hover:bg-cream-100 hover:text-stone-600"
                >
                  Sign out
                </button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
