"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { EntryCard } from "./EntryCard";
import type { Entry } from "@/lib/queries/entries";

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
] as const;

type TypeFilter = (typeof TYPE_FILTERS)[number]["value"];

interface Props {
  entries: Entry[];
}

/** Extract all searchable text from an entry's prompts JSON. */
function promptText(raw: string | null): string {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw) as { prompt?: string; answer?: string }[];
    return parsed
      .map((p) => `${p.prompt ?? ""} ${p.answer ?? ""}`)
      .join(" ");
  } catch {
    return "";
  }
}

export function JournalSearch({ entries }: Props) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    let results = entries;

    // Type filter
    if (typeFilter !== "all") {
      results = results.filter((e) => e.type === typeFilter);
    }

    // Keyword search — content + prompts
    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter((e) => {
        const haystack =
          e.content.toLowerCase() + " " + promptText(e.prompts).toLowerCase();
        return haystack.includes(q);
      });
    }

    return results;
  }, [entries, query, typeFilter]);

  const hasActiveFilter = typeFilter !== "all" || query.trim() !== "";

  function clearFilters() {
    setQuery("");
    setTypeFilter("all");
  }

  // ── Empty state: no entries in DB at all ──────────────────────────────────
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 py-16 text-center">
        <p className="mb-3 text-2xl">📓</p>
        <p className="mb-1 font-medium text-stone-600">No entries yet.</p>
        <p className="mb-6 text-sm text-stone-400">
          Start writing to capture your thoughts.
        </p>
        <Link
          href="/journal/new"
          className="rounded-lg bg-stone-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          Write your first entry
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Search + type filter bar ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Search input */}
        <input
          type="search"
          placeholder="Search entries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 shadow-sm transition placeholder:text-stone-300 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
        />

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                typeFilter === value
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        // Empty state: search/filter returned nothing
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 py-14 text-center">
          <p className="font-medium text-stone-500">No results</p>
          <p className="mt-1 text-sm text-stone-400">
            {query.trim()
              ? `Nothing matched "${query.trim()}". Try a different keyword.`
              : `No ${typeFilter.toLowerCase()} entries yet.`}
          </p>
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-stone-500 underline underline-offset-2 transition hover:text-stone-700"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Result count badge — only shown when a filter is active */}
          {hasActiveFilter && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-400">
                {filtered.length} of {entries.length}{" "}
                {entries.length === 1 ? "entry" : "entries"}
              </p>
              <button
                onClick={clearFilters}
                className="text-xs text-stone-400 underline underline-offset-2 transition hover:text-stone-600"
              >
                Clear
              </button>
            </div>
          )}

          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
