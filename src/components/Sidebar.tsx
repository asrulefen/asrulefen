"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, Settings, LayoutDashboard, ListChecks } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Data Siswa", href: "/siswa", icon: Users },
    { name: "Indikator", href: "/indikator", icon: ListChecks },
    { name: "Input Raport", href: "/raport", icon: FileText },
    { name: "Pengaturan", href: "/pengaturan", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 text-slate-900 min-h-screen p-4 flex flex-col">
      <div className="flex items-center space-x-3 mb-8 px-2">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg">
          TK
        </div>
        <h1 className="text-lg font-bold tracking-tight text-slate-800">PGRI Nur Ikhlas</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                active
                  ? "bg-emerald-50 text-emerald-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200 text-xs text-slate-500 text-center font-medium">
        Versi 1.0.0 &copy; 2026
      </div>
    </div>
  );
}
