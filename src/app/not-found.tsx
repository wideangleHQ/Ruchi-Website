import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-text">Page not found</h1>
      <p className="mt-2 text-sm text-muted-text">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm text-primary-green underline">
        Back to home
      </Link>
    </div>
  );
}
