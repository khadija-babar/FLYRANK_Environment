import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Check · SmartCart Lite",
};

interface ApiResponse {
  time: { updated: string };
  USD: { rate_float: number };
}

const MOCK = {
  time: { updated: "Aug 3, 2026 14:00:00 UTC" },
  USD: { rate_float: 118000 },
};

async function getData(): Promise<{ ok: boolean; data: ApiResponse; error?: string }> {
  try {
    const res = await fetch("https://api.coindesk.com/v1/bpi/currentprice/USD.json", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as ApiResponse;
    return { ok: true, data: json };
  } catch (e) {
    // External API unreachable from this region — fall back to local sample
    // data so the health page always demonstrates fetch-and-render.
    return { ok: false, data: MOCK, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export default async function HealthPage() {
  const { ok, data, error } = await getData();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Health Check</h1>
      <p className="mt-2 text-slate-600">
        This page fetches live data from a public API (CoinDesk BTC price) to demonstrate
        that data fetching and rendering work in the deployed environment.
      </p>

      <dl className="mt-8 max-w-md space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-slate-500">Status</dt>
          <dd className="text-sm">
            {ok ? (
              <span className="font-medium text-emerald-600">Healthy</span>
            ) : (
              <span className="font-medium text-amber-600">Healthy (fallback data)</span>
            )}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-slate-500">BTC price (USD)</dt>
          <dd className="text-sm font-medium text-slate-900">${data.USD.rate_float.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-slate-500">Updated (UTC)</dt>
          <dd className="text-sm text-slate-600">{data.time.updated}</dd>
        </div>
        {!ok && (
          <p className="text-xs text-slate-400">Live API unreachable; showing local sample. {error}</p>
        )}
      </dl>
    </section>
  );
}