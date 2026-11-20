// Next.js shows this automatically while the shelf page is loading.
// This file lives in the (shelf) folder. Folders in parentheses are "route groups": they do not
// change the URL, they only decide which pages the loading skeleton applies to.
export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading your snippets">
      <div className="h-12 w-56 border-2 border-ink bg-paper motion-safe:animate-pulse" />
      <div className="h-28 border-2 border-ink bg-paper motion-safe:animate-pulse" />
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-72 border-2 border-ink bg-paper motion-safe:animate-pulse" />
        ))}
      </div>
    </div>
  );
}
