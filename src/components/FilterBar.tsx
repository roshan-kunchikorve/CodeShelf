// The search box, the language dropdown and the clickable language/tag chips.
// It has NO JavaScript of its own: the form puts the filters in the URL (/dashboard?q=...),
// and the dashboard page reads them from there.
import Form from "next/form";
import Link from "next/link";
import { Search } from "lucide-react";
import { getLanguage, languages } from "@/lib/languages";
import type { Filters } from "@/lib/snippets";

type Props = {
  filters: Filters;
  languageCounts: { value: string; count: number }[];
  tagCounts: { name: string; count: number }[];
};

// Builds a link like /dashboard?lang=python&tag=api.
// `change` says which filter to switch on (or off, by passing undefined).
function buildHref(filters: Filters, change: Partial<Filters>): string {
  const merged = { ...filters, ...change };
  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.lang) params.set("lang", merged.lang);
  if (merged.tag) params.set("tag", merged.tag);
  if (merged.fav) params.set("fav", merged.fav);

  const text = params.toString();
  return text ? `/dashboard?${text}` : "/dashboard";
}

export default function FilterBar({ filters, languageCounts, tagCounts }: Props) {
  const hasFilters = Boolean(filters.q || filters.lang || filters.tag || filters.fav);

  return (
    <section aria-label="Search and filter" className="space-y-3">
      <Form action="/dashboard" className="card flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-48 flex-1">
          <label htmlFor="q" className="mb-1 block text-sm font-semibold">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Title, description, code or tag"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="lang" className="mb-1 block text-sm font-semibold">
            Language
          </label>
          <select id="lang" name="lang" defaultValue={filters.lang ?? ""} className="input">
            <option value="">All languages</option>
            {languages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 pb-2 font-semibold">
          <input
            type="checkbox"
            name="fav"
            value="1"
            defaultChecked={filters.fav === "1"}
            className="size-5 accent-ink"
          />
          Favorites only
        </label>

        {/* Keep the selected tag when the form is submitted. */}
        {filters.tag && <input type="hidden" name="tag" value={filters.tag} />}

        <button type="submit" className="btn btn-primary">
          <Search size={16} aria-hidden="true" />
          Search
        </button>
        {hasFilters && (
          <Link href="/dashboard" className="btn">
            Clear
          </Link>
        )}
      </Form>

      {languageCounts.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Filter by language">
          {languageCounts.map((item) => {
            const language = getLanguage(item.value);
            const isActive = filters.lang === item.value;
            return (
              <li key={item.value}>
                <Link
                  href={buildHref(filters, { lang: isActive ? undefined : item.value })}
                  className={isActive ? "chip bg-lemon" : "chip"}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className="size-2.5 rounded-full border border-ink"
                    style={{ backgroundColor: language.color }}
                    aria-hidden="true"
                  />
                  {language.label}
                  <span className="font-normal text-muted">{item.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {tagCounts.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Filter by tag">
          {tagCounts.map((item) => {
            const isActive = filters.tag === item.name;
            return (
              <li key={item.name}>
                <Link
                  href={buildHref(filters, { tag: isActive ? undefined : item.name })}
                  className={isActive ? "chip bg-lemon" : "chip"}
                  aria-current={isActive ? "true" : undefined}
                >
                  #{item.name}
                  <span className="font-normal text-muted">{item.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
