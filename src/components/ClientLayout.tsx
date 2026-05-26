"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return (
      <main className="w-full min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
          
          <footer className="mt-16 mb-4 text-center">
            <p className="text-sm font-medium text-slate-500 animate-pulse transition-all hover:text-emerald-600">
              website dibuat oleh <span className="font-bold text-emerald-600 text-base">asrulefen</span>
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
