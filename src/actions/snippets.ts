"use server";

// Every change to the database goes through this file (create, edit, delete, favorite, share, copy).
// Each action does the same three things:
//   1. Find out who is logged in.
//   2. Check the data (and check the snippet belongs to that user).
//   3. Change the database, then refresh the page.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { FormState } from "@/lib/types";
import { isValidId } from "@/lib/utils";
import { cleanTags, snippetSchema, toFieldErrors } from "@/lib/validation";

// Returns the logged-in user's id. If nobody is logged in, send them to /login.
// We check here even though the middleware already protects /dashboard,
// because a server action can be called directly, without visiting a page.
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

// Reads the fields out of the submitted form.
function readForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    language: String(formData.get("language") ?? ""),
    code: String(formData.get("code") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    isPublic: formData.get("isPublic") === "on" ? "on" : "",
  };
}

export async function createSnippet(_prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const values = readForm(formData);

  const parsed = snippetSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error), values };
  }

  await db.snippet.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      language: parsed.data.language,
      code: parsed.data.code,
      tags: cleanTags(values.tags),
      isPublic: values.isPublic === "on",
      userId,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// `id` comes first because we attach it with .bind() in the edit page.
export async function updateSnippet(id: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const values = readForm(formData);

  const parsed = snippetSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error), values };
  }
  if (!isValidId(id)) {
    return { error: "We could not find that snippet.", values };
  }

  // Because the filter includes userId, nobody can edit someone else's snippet.
  const result = await db.snippet.updateMany({
    where: { id, userId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      language: parsed.data.language,
      code: parsed.data.code,
      tags: cleanTags(values.tags),
      isPublic: values.isPublic === "on",
    },
  });
  if (result.count === 0) {
    return { error: "We could not find that snippet.", values };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/s/${id}`);
  redirect("/dashboard");
}

export async function deleteSnippet(id: string) {
  const userId = await requireUserId();
  if (!isValidId(id)) return;

  await db.snippet.deleteMany({ where: { id, userId } });

  revalidatePath("/dashboard");
  revalidatePath(`/s/${id}`);
}

export async function toggleFavorite(id: string) {
  const userId = await requireUserId();
  if (!isValidId(id)) return;

  const snippet = await db.snippet.findFirst({ where: { id, userId }, select: { isFavorite: true } });
  if (!snippet) return;

  await db.snippet.update({ where: { id }, data: { isFavorite: !snippet.isFavorite } });

  revalidatePath("/dashboard");
}

export async function togglePublic(id: string) {
  const userId = await requireUserId();
  if (!isValidId(id)) return;

  const snippet = await db.snippet.findFirst({ where: { id, userId }, select: { isPublic: true } });
  if (!snippet) return;

  await db.snippet.update({ where: { id }, data: { isPublic: !snippet.isPublic } });

  revalidatePath("/dashboard");
  revalidatePath(`/s/${id}`);
}

// "Save to my shelf": copies a public snippet (or one of your own) into your account.
export async function forkSnippet(id: string) {
  const userId = await requireUserId();
  if (!isValidId(id)) return;

  const original = await db.snippet.findFirst({
    where: { id, OR: [{ isPublic: true }, { userId }] },
  });
  if (!original) return;

  await db.snippet.create({
    data: {
      title: `${original.title} (copy)`.slice(0, 80),
      description: original.description,
      language: original.language,
      code: original.code,
      tags: original.tags,
      userId,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
