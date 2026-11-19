// All the database READS live here, so pages stay short and easy to read.
// (The WRITES - create, update, delete - live in src/actions/snippets.ts.)
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { isValidId } from "@/lib/utils";

// The filters on the dashboard. They come from the URL, e.g. /dashboard?q=debounce&lang=javascript
export type Filters = {
  q?: string; // search text
  lang?: string; // language value
  tag?: string; // one tag
  fav?: string; // "1" = favorites only
};

// The user's snippets, newest edit first, narrowed down by the filters.
export async function getSnippets(userId: string, filters: Filters) {
  // We start with "only this user's snippets" and add one rule per active filter.
  const where: Prisma.SnippetWhereInput = { userId };

  const search = filters.q?.trim();
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { tags: { has: search.toLowerCase() } },
    ];
  }
  if (filters.lang) where.language = filters.lang;
  if (filters.tag) where.tags = { has: filters.tag };
  if (filters.fav === "1") where.isFavorite = true;

  return db.snippet.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 60,
  });
}

// Numbers for the dashboard header and the language/tag chips.
// We fetch a few small fields for every snippet and count them with a loop.
// That is fine for hundreds of snippets. (For thousands you would let the database count.)
export async function getStats(userId: string) {
  const all = await db.snippet.findMany({
    where: { userId },
    select: { language: true, tags: true, isFavorite: true, isPublic: true },
  });

  let favorites = 0;
  let publicCount = 0;
  const languageCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};

  for (const item of all) {
    if (item.isFavorite) favorites++;
    if (item.isPublic) publicCount++;

    languageCounts[item.language] = (languageCounts[item.language] ?? 0) + 1;

    for (const tag of item.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  const languages: { value: string; count: number }[] = [];
  for (const value in languageCounts) {
    languages.push({ value, count: languageCounts[value] });
  }
  languages.sort((a, b) => b.count - a.count); // biggest first

  const tags: { name: string; count: number }[] = [];
  for (const name in tagCounts) {
    tags.push({ name, count: tagCounts[name] });
  }
  tags.sort((a, b) => b.count - a.count);

  return {
    total: all.length,
    favorites,
    publicCount,
    languages,
    tags: tags.slice(0, 12), // only show the 12 most used tags
  };
}

// One snippet, but ONLY if it belongs to this user. Used by the edit page.
export async function getOwnedSnippet(id: string, userId: string) {
  if (!isValidId(id)) return null;
  return db.snippet.findFirst({ where: { id, userId } });
}

// One snippet for the share page and the /raw link.
// Allowed if the snippet is public, or if the viewer is the owner. Anyone else gets null.
// `cache` makes the page title and the page body share ONE database query per request.
export const getViewableSnippet = cache(async (id: string, viewerId?: string) => {
  if (!isValidId(id)) return null;

  const snippet = await db.snippet.findUnique({
    where: { id },
    include: { user: { select: { name: true, image: true } } },
  });
  if (!snippet) return null;

  const isOwner = snippet.userId === viewerId;
  if (!snippet.isPublic && !isOwner) return null;

  return { snippet, isOwner };
});
