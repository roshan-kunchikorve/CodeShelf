// Never trust data from the browser. Zod checks every field on the server before we save anything.
import { z } from "zod";
import { isKnownLanguage } from "@/lib/languages";

export const snippetSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give your snippet a title.")
    .max(80, "Keep the title under 80 characters."),
  description: z.string().trim().max(300, "Keep the description under 300 characters."),
  language: z.string().refine(isKnownLanguage, "Pick a language from the list."),
  code: z
    .string()
    .max(20000, "That is too long. The limit is 20,000 characters.")
    .refine((value) => value.trim().length > 0, "Paste some code first."),
});

// "React, hooks,  State" -> ["react", "hooks", "state"]
// Lower-case, no duplicates, at most 8 tags, each at most 24 characters.
export function cleanTags(raw: string): string[] {
  const tags: string[] = [];

  for (const piece of raw.split(",")) {
    const tag = piece.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 24);
    if (tag !== "" && !tags.includes(tag)) {
      tags.push(tag);
    }
    if (tags.length === 8) break;
  }

  return tags;
}

// Zod reports a list of problems. The form wants one message per field, so we reshape the list.
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0]);
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
