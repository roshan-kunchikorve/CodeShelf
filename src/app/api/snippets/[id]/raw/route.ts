// GET /api/snippets/<id>/raw  ->  the snippet's code as plain text.
// Handy in a terminal:  curl https://your-site.com/api/snippets/<id>/raw > helper.js
import { auth } from "@/auth";
import { getViewableSnippet } from "@/lib/snippets";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  // Same rule as the share page: public snippets, or your own.
  const found = await getViewableSnippet(id, session?.user?.id);
  if (!found) {
    return new Response("Snippet not found", { status: 404 });
  }

  return new Response(found.snippet.code, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
