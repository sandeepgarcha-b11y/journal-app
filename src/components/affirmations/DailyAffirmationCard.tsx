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
    <div className="relative rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-5 shadow-sm">
      {/* Label */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
        Affirmation of the day
      </p>

      {/* Text */}
      <p className="text-base font-medium leading-relaxed text-stone-800 italic">
        &ldquo;{affirmation.text}&rdquo;
      </p>

      {/* Favourite toggle */}
      <button
        onClick={handleToggle}
        disabled={pending}
        title={isFav ? "Remove from favourites" : "Add to favourites"}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:scale-110 disabled:opacity-50"
        aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
      >
        {isFav ? "★" : "☆"}
      </button>
    </div>
  );
}
