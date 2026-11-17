// The full login setup: the shared config + the database.
// Import `auth` to ask "who is logged in?", and `signIn` / `signOut` to log in and out.
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // The adapter saves users and their GitHub/Google accounts in MongoDB.
  adapter: PrismaAdapter(db),
  // "jwt" = the login lives in a signed cookie. The middleware can read it without touching the database.
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    // By default the session does not include the user's id. We copy it over from the token,
    // because we need it to find "this user's snippets".
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
