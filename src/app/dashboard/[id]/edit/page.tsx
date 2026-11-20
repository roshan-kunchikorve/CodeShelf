import { notFound, redirect } from "next/navigation";
import { updateSnippet } from "@/actions/snippets";
import { auth } from "@/auth";
import SnippetForm from "@/components/SnippetForm";
import { getOwnedSnippet } from "@/lib/snippets";

export const metadata = { title: "Edit snippet" };

export default async function EditSnippetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Only the owner can load this page. Anyone else gets a 404.
  const snippet = await getOwnedSnippet(id, session.user.id);
  if (!snippet) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight">Edit snippet</h1>
      {/* .bind attaches the snippet id as the first argument of updateSnippet. */}
      <SnippetForm action={updateSnippet.bind(null, snippet.id)} snippet={snippet} />
    </div>
  );
}
