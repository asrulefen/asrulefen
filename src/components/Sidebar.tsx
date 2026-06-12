"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, Settings, LayoutDashboard, ListChecks, LogOut, Archive, HeartPulse, Image as ImageIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();
  
  if (pathname === '/login' || pathname === '/register') return null;

  const menu = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Data Siswa", href: "/siswa", icon: Users },
    { name: "Indikator", href: "/indikator", icon: ListChecks },
    { name: "Data Fisik", href: "/data-fisik", icon: HeartPulse },
    { name: "Bank Foto", href: "/foto", icon: ImageIcon },
    { name: "Input Raport", href: "/raport", icon: FileText },
    { name: "Arsip Raport", href: "/arsip", icon: Archive },
    { name: "Pengaturan", href: "/pengaturan", icon: Settings },
  ];

  return (
    <div className="w-full md:w-64 bg-white border-t md:border-r border-slate-200 text-slate-900 md:min-h-screen py-1.5 px-1 md:p-4 flex flex-row md:flex-col fixed md:static bottom-0 left-0 right-0 z-50 justify-around md:justify-start">
      <div className="hidden md:flex items-center space-x-3 mb-8 px-2">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg">
          TK
        </div>
        <h1 className="text-lg font-bold tracking-tight text-slate-800">PGRI Nur Ikhlas</h1>
      </div>

      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start w-full md:w-auto md:space-y-2">
        {menu.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col md:flex-row items-center md:space-x-3 px-1 md:px-3 py-1 md:py-2.5 rounded-lg transition-colors flex-1 md:flex-none justify-center",
                active
                  ? "md:bg-emerald-50 text-emerald-600 font-semibold"
                  : "text-slate-400 md:text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
              )}
            >
              <Icon className="w-5 h-5 md:w-5 md:h-5 mb-0.5 md:mb-0" />
              <span className="text-[9px] md:text-base whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
        
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex flex-col md:flex-row items-center md:space-x-3 px-1 md:px-3 py-1 md:py-2.5 rounded-lg transition-colors flex-1 md:flex-none justify-center text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 md:w-5 md:h-5 mb-0.5 md:mb-0" />
          <span className="text-[9px] md:text-base whitespace-nowrap">Logout</span>
        </button>
      </nav>

      <div className="hidden md:block mt-auto pt-4 border-t border-slate-200 text-xs text-slate-500 text-center font-medium">
        Versi 1.0.0 &copy; 2026
      </div>
    </div>
  );
}
