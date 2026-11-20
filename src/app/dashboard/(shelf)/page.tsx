// The dashboard: the logged-in user's snippets, with search and filters.
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import FilterBar from "@/components/FilterBar";
import SnippetCard from "@/components/SnippetCard";
import { getSnippets, getStats, type Filters } from "@/lib/snippets";

export const metadata = { title: "My shelf" };

// A URL like ?tag=a&tag=b gives an array. We only want the first value.
function pickOne(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="card p-8">
        <h2 className="text-xl font-bold">No snippets match those filters</h2>
        <p className="mt-1 text-muted">Try a different word, or clear the filters to see everything.</p>
        <Link href="/dashboard" className="btn mt-4">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h2 className="text-xl font-bold">Your shelf is empty</h2>
      <p className="mt-1 text-muted">Save the first piece of code you keep googling. It takes a minute.</p>
      <Link href="/dashboard/new" className="btn btn-primary mt-4">
        Add your first snippet
      </Link>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  // The middleware already blocks logged-out visitors. Checking again is a good habit.
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // The filters live in the URL, for example /dashboard?q=debounce&lang=javascript
  const params = await searchParams;
  const filters: Filters = {
    q: pickOne(params.q),
    lang: pickOne(params.lang),
    tag: pickOne(params.tag),
    fav: pickOne(params.fav),
  };
  const hasFilters = Boolean(filters.q || filters.lang || filters.tag || filters.fav);

  // Run both database queries at the same time instead of one after the other.
  const [snippets, stats] = await Promise.all([getSnippets(userId, filters), getStats(userId)]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Your shelf</h1>
        <p className="mt-1 text-muted">
          {stats.total === 0
            ? "Nothing saved yet."
            : `${stats.total} saved, ${stats.favorites} favorites, ${stats.publicCount} public`}
        </p>
      </div>

      <FilterBar filters={filters} languageCounts={stats.languages} tagCounts={stats.tags} />

      {snippets.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
}
