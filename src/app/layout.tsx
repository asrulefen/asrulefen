import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raport TK PGRI Nur Ikhlas",
  description: "Aplikasi Input Raport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 text-slate-900 flex flex-col md:flex-row min-h-screen`}>
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
