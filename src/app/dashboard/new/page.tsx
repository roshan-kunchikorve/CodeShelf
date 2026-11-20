import { createSnippet } from "@/actions/snippets";
import SnippetForm from "@/components/SnippetForm";

export const metadata = { title: "New snippet" };

export default function NewSnippetPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight">New snippet</h1>
      <SnippetForm action={createSnippet} />
    </div>
  );
}
