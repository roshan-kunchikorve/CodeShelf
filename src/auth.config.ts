// The part of the login setup that is safe to run in the middleware.
// The middleware runs on the "edge", where the database library does not work,
// so we keep the database out of this file. The full setup is in auth.ts.
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { authRoutes, DEFAULT_LOGIN_REDIRECT, protectedRoutes } from "@/routes";

// GitHub is always on. Google switches on only when its keys are in your .env file.
// GitHub and Google read AUTH_GITHUB_ID / AUTH_GITHUB_SECRET / AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET by themselves.
// "allowDangerousEmailAccountLinking" lets the same person sign in with either one and land in the same account.
const providers: NextAuthConfig["providers"] = [GitHub({ allowDangerousEmailAccountLinking: true })];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google({ allowDangerousEmailAccountLinking: true }));
}

export default {
  providers,
  // Vercel is trusted automatically. On other hosts (Render, Railway, Docker...) Auth.js refuses to work
  // unless it is told to trust the host name. For extra safety you can also set AUTH_URL to your site address.
  trustHost: true,
  pages: { signIn: "/login" },
  callbacks: {
    // Runs in the middleware before a page loads.
    // Return true = let them in, false = send them to /login, a redirect = send them somewhere else.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const path = nextUrl.pathname;

      const isProtected = protectedRoutes.some((route) => path.startsWith(route));
      const isAuthPage = authRoutes.includes(path);

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      if (isProtected && !isLoggedIn) {
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
