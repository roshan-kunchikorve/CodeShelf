"use server";

// Server actions = functions that run on the server but can be called straight from a <form>.
import { signIn, signOut } from "@/auth";

export async function loginWithGitHub() {
  await signIn("github", { redirectTo: "/dashboard" });
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
