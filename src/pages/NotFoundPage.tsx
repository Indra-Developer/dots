import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="text-center">
        <p className="text-7xl font-semibold text-slate-200">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Page not found
        </h1>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-slate-900 px-6 py-3 font-medium text-white"
        >
          Return Home
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
