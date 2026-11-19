// A MongoDB id is always 24 hex characters. Checking this first stops Prisma
// from throwing an error when someone opens a made-up URL like /s/hello.
export function isValidId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Turns a Date into text like "Nov 1, 2026".
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
