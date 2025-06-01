import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-red-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-white">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-400">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
        >
          ← Go back home
        </Link>
      </div>
    </main>
  );
}
