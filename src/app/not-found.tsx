import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto mt-10 max-w-lg p-8">
      <h1 className="text-3xl font-extrabold">We could not find that page</h1>
      <p className="mt-2 text-muted">
        The link may be wrong, or the owner made the snippet private or deleted it.
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
