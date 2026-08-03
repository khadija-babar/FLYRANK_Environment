import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Compare prices across stores, with AI.
        </h1>
        <p className="mt-4 text-slate-600">
          Add product listings from your favorite stores. SmartCart Lite uses AI to
          match equivalent products and surfaces the best price.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Add a product
          </Link>
          <Link
            href="/compare"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            View comparison
          </Link>
        </div>
      </div>
    </section>
  );
}