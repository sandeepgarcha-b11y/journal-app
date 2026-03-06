import Link from "next/link";
import { getAffirmations } from "@/lib/queries/affirmations";
import { AffirmationCard } from "@/components/affirmations/AffirmationCard";

export const metadata = {
  title: "Journal — Affirmations",
};

interface Props {
  searchParams: Promise<{ filter?: string }>;
}

export default async function AffirmationsPage({ searchParams }: Props) {
  const { filter } = await searchParams;
  const favouritesOnly = filter === "favourites";

  const affirmations = await getAffirmations(favouritesOnly);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">
            Affirmations
          </h1>
          <p className="mt-0.5 text-sm text-stone-400">
            {affirmations.length === 0
              ? favouritesOnly
                ? "No favourites yet — star one below"
                : "No affirmations yet — run the seed command"
              : `${affirmations.length} ${
                  favouritesOnly ? "favourited" : "total"
                }`}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 rounded-lg border border-stone-200 bg-stone-50 p-1">
          <Link
            href="/affirmations"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              !favouritesOnly
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            All
          </Link>
          <Link
            href="/affirmations?filter=favourites"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              favouritesOnly
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            ★ Favourites
          </Link>
        </div>
      </div>

      {/* Grid */}
      {affirmations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 py-16 text-center">
          <p className="text-sm text-stone-400">
            {favouritesOnly
              ? "Star any affirmation to save it here."
              : "Run the seed to populate affirmations."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {affirmations.map((a) => (
            <AffirmationCard key={a.id} affirmation={a} />
          ))}
        </div>
      )}
    </div>
  );
}
