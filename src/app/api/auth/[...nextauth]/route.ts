// Auth.js needs these two routes (GET and POST) to handle sign-in callbacks from GitHub and Google.
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
