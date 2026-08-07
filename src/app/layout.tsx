import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCart Lite",
  description: "AI-assisted price comparison across your favorite stores.",
  icons: {
    icon: "/favicon.svg",
  },
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Assistant" },
  { href: "/products", label: "Products" },
  { href: "/compare", label: "Compare" },
  { href: "/cart", label: "Cart" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
            <Link href="/" className="text-base font-semibold text-slate-900">
              SmartCart <span className="text-violet-600">Lite</span>
            </Link>
            <nav aria-label="Main">
              <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      // Don't prefetch the heavy /chat route from the header;
                      // it pulls the AI SDK bundle into every page's audit.
                      prefetch={link.href === "/chat" ? false : undefined}
                      className="block rounded-md px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500">
            <p>SmartCart Lite — FlyRank Frontend AI Engineering capstone.</p>
            <p className="mt-1">Khadija Babar · FAST-NUCES Peshawar</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
