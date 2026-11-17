// Runs before every page request (except the paths excluded in `matcher`).
// It uses the `authorized` rule from auth.config.ts to protect /dashboard.
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Skip API routes, Next.js internals and image files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
