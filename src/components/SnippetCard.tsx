// One snippet on the dashboard. A server component: it only shows things.
// The buttons are small <form>s that call server actions.
import Link from "next/link";
import type { Snippet } from "@prisma/client";
import { Globe, Lock, Pencil, Star } from "lucide-react";
import { deleteSnippet, toggleFavorite, togglePublic } from "@/actions/snippets";
import CodeBlock from "@/components/CodeBlock";
import CopyButton from "@/components/CopyButton";
import DeleteButton from "@/components/DeleteButton";
import { getLanguage } from "@/lib/languages";
import { formatDate } from "@/lib/utils";

const PREVIEW_LINES = 10;

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
  const language = getLanguage(snippet.language);
  const hiddenLines = snippet.code.split("\n").length - PREVIEW_LINES;

  return (
    <article className="card flex overflow-hidden">
      {/* The coloured strip on the left is the "spine". Its colour tells you the language. */}
      <div
        className="w-3 shrink-0 border-r-2 border-ink"
        style={{ backgroundColor: language.color }}
        aria-hidden="true"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold leading-tight">
              <Link href={`/s/${snippet.id}`} className="underline-offset-4 hover:underline">
                {snippet.title}
              </Link>
            </h2>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
              <span
                className="size-2.5 rounded-full border border-ink"
                style={{ backgroundColor: language.color }}
                aria-hidden="true"
              />
              {language.label}
            </p>
          </div>

          <form action={toggleFavorite.bind(null, snippet.id)}>
            <button
              type="submit"
              className="p-1"
              aria-label={snippet.isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={snippet.isFavorite}
            >
              <Star size={22} className={snippet.isFavorite ? "fill-lemon stroke-ink" : "stroke-ink"} />
            </button>
          </form>
        </div>

        {snippet.description && <p className="line-clamp-2 text-sm text-muted">{snippet.description}</p>}

        <div>
          <div className="border-2 border-ink">
            <CodeBlock code={snippet.code} language={snippet.language} maxLines={PREVIEW_LINES} />
          </div>
          {hiddenLines > 0 && <p className="mt-1 text-xs font-medium text-muted">+{hiddenLines} more lines</p>}
        </div>

        {snippet.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {snippet.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/dashboard?tag=${encodeURIComponent(tag)}`} className="chip">
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-muted">Updated {formatDate(snippet.updatedAt)}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t-2 border-ink pt-3">
          <CopyButton text={snippet.code} label="Copy" small />

          <Link href={`/dashboard/${snippet.id}/edit`} className="btn btn-sm">
            <Pencil size={16} aria-hidden="true" />
            Edit
          </Link>

          <form action={togglePublic.bind(null, snippet.id)}>
            <button
              type="submit"
              className={snippet.isPublic ? "btn btn-sm bg-lemon" : "btn btn-sm"}
              title={
                snippet.isPublic
                  ? "Public: anyone with the link can view it. Click to make it private."
                  : "Private: only you can see it. Click to make it public."
              }
            >
              {snippet.isPublic ? <Globe size={16} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />}
              {snippet.isPublic ? "Public" : "Private"}
            </button>
          </form>

          {snippet.isPublic && <CopyButton text={`/s/${snippet.id}`} label="Copy link" isPath small />}

          <div className="ml-auto">
            <DeleteButton action={deleteSnippet.bind(null, snippet.id)} />
          </div>
        </div>
      </div>
    </article>
  );
}
