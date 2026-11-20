// The share page: /s/<snippet id>
// Anyone can open it if the snippet is public. Private snippets only open for their owner.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookmarkPlus, FileText, Pencil } from "lucide-react";
import { forkSnippet } from "@/actions/snippets";
import { auth } from "@/auth";
import CodeBlock from "@/components/CodeBlock";
import CopyButton from "@/components/CopyButton";
import { getLanguage } from "@/lib/languages";
import { getViewableSnippet } from "@/lib/snippets";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

// Sets the browser tab title. getViewableSnippet is cached, so this does not cost a second query.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();
  const found = await getViewableSnippet(id, session?.user?.id);
  return { title: found ? found.snippet.title : "Snippet not found" };
}

export default async function SnippetPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const found = await getViewableSnippet(id, session?.user?.id);
  if (!found) notFound();

  const { snippet, isOwner } = found;
  const language = getLanguage(snippet.language);

  return (
    <article className="card mx-auto flex max-w-4xl overflow-hidden">
      <div
        className="w-3 shrink-0 border-r-2 border-ink"
        style={{ backgroundColor: language.color }}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1 space-y-5 p-6">
        {!snippet.isPublic && (
          <p className="border-2 border-ink bg-lemon px-3 py-2 text-sm font-semibold">
            This snippet is private. Only you can see this page. Make it public from your shelf to share the link.
          </p>
        )}

        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">{snippet.title}</h1>
          {snippet.description && <p className="mt-2 max-w-2xl text-lg text-muted">{snippet.description}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            {snippet.user.image ? (
              <Image
                src={snippet.user.image}
                alt=""
                width={24}
                height={24}
                className="size-6 border-2 border-ink"
              />
            ) : null}
            By {snippet.user.name ?? "someone"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full border border-ink"
              style={{ backgroundColor: language.color }}
              aria-hidden="true"
            />
            {language.label}
          </span>
          <span className="text-muted">Updated {formatDate(snippet.updatedAt)}</span>
        </div>

        {snippet.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {snippet.tags.map((tag) => (
              <li key={tag} className="chip hover:bg-paper">
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-3">
          <CopyButton text={snippet.code} label="Copy code" />
          {snippet.isPublic && <CopyButton text={`/s/${snippet.id}`} label="Copy link" isPath />}
          <a href={`/api/snippets/${snippet.id}/raw`} target="_blank" rel="noopener noreferrer" className="btn">
            <FileText size={16} aria-hidden="true" />
            Raw
          </a>

          {isOwner ? (
            <Link href={`/dashboard/${snippet.id}/edit`} className="btn btn-primary">
              <Pencil size={16} aria-hidden="true" />
              Edit
            </Link>
          ) : session?.user ? (
            <form action={forkSnippet.bind(null, snippet.id)}>
              <button type="submit" className="btn btn-primary">
                <BookmarkPlus size={16} aria-hidden="true" />
                Save to my shelf
              </button>
            </form>
          ) : (
            <Link href="/login" className="btn btn-primary">
              Sign in to save a copy
            </Link>
          )}
        </div>

        <div className="border-2 border-ink">
          <CodeBlock code={snippet.code} language={snippet.language} />
        </div>
      </div>
    </article>
  );
}
