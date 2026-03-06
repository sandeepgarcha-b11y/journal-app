"use client";

import { useState } from "react";
import { toggleFavourite } from "@/lib/actions/affirmations";
import type { Affirmation } from "@/lib/queries/affirmations";

interface Props {
  affirmation: Affirmation;
}

export function AffirmationCard({ affirmation }: Props) {
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
    <div className="flex items-start justify-between gap-3 rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm leading-relaxed text-stone-700">{affirmation.text}</p>
      <button
        onClick={handleToggle}
        disabled={pending}
        title={isFav ? "Remove from favourites" : "Add to favourites"}
        className={`mt-0.5 shrink-0 text-lg transition hover:scale-110 disabled:opacity-50 ${
          isFav ? "text-amber-400" : "text-stone-300 hover:text-amber-300"
        }`}
        aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
      >
        ★
      </button>
    </div>
  );
}
