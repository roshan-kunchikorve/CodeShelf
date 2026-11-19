// Tells TypeScript that session.user has an `id`. Without this, `session.user.id` is a type error.
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}
