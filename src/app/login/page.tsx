"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2, Sparkles, BookOpen, KeyRound, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Email atau Password salah!");
      setIsLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed inset-0 w-full flex items-center justify-center overflow-y-auto overflow-x-hidden bg-white py-8">
      <div className="min-h-full w-full flex flex-col items-center justify-center relative">
      {/* Background Animasi Bergerak (Soft Light Theme) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/40 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-300/40 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite]" style={{animationDelay: "2s"}}></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-300/30 rounded-full blur-[80px] animate-[pulse_12s_ease-in-out_infinite]" style={{animationDelay: "4s"}}></div>
        
        {/* Animated Particles Dark */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNCkiLz48L3N2Zz4=')] opacity-50 animate-[spin_120s_linear_infinite]"></div>
      </div>

      <div className="z-10 w-full max-w-md px-4 relative flex flex-col justify-center my-auto">
        
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
          {/* Glass Reflection effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>

          <div className="text-center mb-4 sm:mb-6 relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl mb-3 shadow-lg shadow-emerald-200 transform transition-transform hover:scale-110 hover:rotate-3">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
              Raport <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Pintar</span>
            </h1>
            <h2 className="text-base sm:text-lg font-bold text-slate-600 mb-2">TK PGRI</h2>
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sistem Penilaian AI</span>
            </div>
          </div>

          {/* Tips for teachers */}
          <div className="bg-blue-50/80 border border-blue-100 text-blue-700 px-4 py-3 rounded-xl mb-5 text-[11px] sm:text-xs font-medium leading-relaxed relative z-10 shadow-sm backdrop-blur-sm">
            <span className="font-bold block mb-1">💡 Info Login:</span>
            Masukkan email (misal: @gmail.com) dan password yang sudah Anda <b>daftarkan</b> di aplikasi ini. Jika belum punya akun, silakan klik tombol daftar di bawah.
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl mb-5 font-bold text-sm text-center flex items-center justify-center gap-2 animate-[pulse_2s_ease-in-out_infinite]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                <Mail className="w-4 h-4 text-slate-400" /> Email Guru
              </label>
              <input 
                type="email" 
                required
                className="w-full bg-white text-slate-800 text-[16px] px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-400 focus:ring-0 transition-all outline-none placeholder-slate-400 shadow-sm"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                <KeyRound className="w-4 h-4 text-slate-400" /> Password
              </label>
              <input 
                type="password" 
                required
                className="w-full bg-white text-slate-800 text-[16px] px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-400 focus:ring-0 transition-all outline-none placeholder-slate-400 shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl flex justify-center items-center transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] active:scale-95 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> 
                  <span className="animate-pulse">Memverifikasi...</span>
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-slate-500 font-medium text-xs sm:text-sm relative z-10">
            Belum memiliki akses? <Link href="/register" className="text-emerald-600 hover:text-emerald-500 font-bold underline decoration-emerald-200 underline-offset-4">Daftar sekarang</Link>
          </div>
        </div>
        
        <div className="text-center mt-6 text-slate-400 text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-slate-200"></div>
          Dikembangkan oleh Asrulefen
          <div className="h-px w-8 bg-slate-200"></div>
        </div>
      </div>
    </div>
  </div>
  );
}
