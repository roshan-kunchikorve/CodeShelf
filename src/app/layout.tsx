import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: { default: "CodeShelf", template: "%s | CodeShelf" },
  description: "Save, search and share your code snippets.",
};

// The layout wraps EVERY page: navbar on top, the page in the middle, footer at the bottom.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t-2 border-ink bg-paper">
          <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted">
            CodeShelf is a portfolio project built with Next.js, Prisma and MongoDB.
          </p>
        </footer>
      </body>
    </html>
  );
}
