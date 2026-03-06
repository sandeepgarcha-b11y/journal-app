"use client";

import { useState } from "react";
import { toggleFavourite } from "@/lib/actions/affirmations";
import type { Affirmation } from "@/lib/queries/affirmations";

interface Props {
  affirmation: Affirmation;
}

export function DailyAffirmationCard({ affirmation }: Props) {
  const [isFav, setIsFav] = useState(affirmation.isFavourite);
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    if (pending) return;
    setPending(true);
    setIsFav((prev) => !prev); // optimistic
    const fd = new FormData();
    fd.append("id", affirmation.id);
    await toggleFavourite(fd);
    setPending(false);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cream-200 bg-gradient-to-br from-terracotta-50 via-cream-50 to-sage-50 px-7 py-6 shadow-warm-sm animate-fade-in">
      {/* Decorative soft orbs */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-terracotta-100 opacity-30" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-sage-100 opacity-25" />

      {/* Label */}
      <p className="relative mb-3 text-xs font-semibold uppercase tracking-widest text-terracotta-500">
        Affirmation of the day
      </p>

      {/* Quote — serif for warmth */}
      <p className="relative font-serif text-lg font-medium italic leading-relaxed text-stone-800">
        &ldquo;{affirmation.text}&rdquo;
      </p>

      {/* Favourite toggle */}
      <button
        onClick={handleToggle}
        disabled={pending}
        title={isFav ? "Remove from favourites" : "Add to favourites"}
        className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl transition-all duration-150 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 ${
          isFav
            ? "text-terracotta-500"
            : "text-stone-300 hover:text-terracotta-400"
        }`}
        aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
      >
        {isFav ? "★" : "☆"}
      </button>
    </div>
  );
}
