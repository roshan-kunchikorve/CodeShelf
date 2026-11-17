// Which pages need a logged-in user? The middleware reads this file.

// Any URL that STARTS with one of these is private. (/dashboard, /dashboard/new, /dashboard/123/edit ...)
export const protectedRoutes = ["/dashboard"];

// Pages that only make sense for logged-out people. A logged-in user is sent to the dashboard instead.
export const authRoutes = ["/login"];

// Where people land after signing in.
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
