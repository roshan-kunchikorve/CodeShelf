import { loginWithGitHub, loginWithGoogle } from "@/actions/auth";
import { GitHubIcon, GoogleIcon } from "@/components/BrandIcons";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  // The Google button only shows up if you added the Google keys to your .env file.
  const hasGoogle = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <div className="card mx-auto mt-6 max-w-md p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Sign in to CodeShelf</h1>
      <p className="mt-2 text-muted">No password to remember. Use an account you already have.</p>

      {error && (
        <p role="alert" className="mt-5 border-2 border-danger p-3 text-sm font-semibold text-danger">
          Sign in did not work. Please try again.
        </p>
      )}

      <div className="mt-6 space-y-3">
        <form action={loginWithGitHub}>
          <button type="submit" className="btn btn-primary w-full">
            <GitHubIcon />
            Continue with GitHub
          </button>
        </form>

        {hasGoogle && (
          <form action={loginWithGoogle}>
            <button type="submit" className="btn w-full">
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
