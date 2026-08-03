import type { Metadata } from "next";
import { Chat } from "@/components/Chat";

export const metadata: Metadata = {
  title: "AI Assistant · SmartCart Lite",
};

export default function ChatPage() {
  return (
    <section className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-6xl flex-col">
      <div className="px-4 py-4">
        <h1 className="text-xl font-semibold text-slate-900">SmartCart Assistant</h1>
        <p className="text-sm text-slate-500">
          Compare prices across your stores. Responses stream in live — stop them anytime.
        </p>
      </div>
      <div className="min-h-0 flex-1">
        <Chat />
      </div>
    </section>
  );
}