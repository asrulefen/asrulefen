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
      // Menggunakan window.location.href untuk me-refresh state aplikasi secara menyeluruh
      // Ini menyelesaikan masalah harus klik 2 kali saat login
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Animasi Bergerak */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/30 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite]" style={{animationDelay: "2s"}}></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-500/20 rounded-full blur-[80px] animate-[pulse_12s_ease-in-out_infinite]" style={{animationDelay: "4s"}}></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 animate-[spin_120s_linear_infinite]"></div>
      </div>

      <div className="z-10 w-full max-w-md px-4 relative">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full blur-2xl opacity-60 animate-bounce"></div>
        
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          {/* Glass Reflection effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          <div className="absolute -inset-x-20 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent rotate-12 transform -translate-y-20"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/30 transform transition-transform hover:scale-110 hover:rotate-3">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center gap-2">
              Raport <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">Pintar</span>
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-emerald-100/70 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Sistem Penilaian AI</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-6 font-medium text-sm text-center flex items-center justify-center gap-2 animate-[pulse_2s_ease-in-out_infinite]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 ml-1">
                <Mail className="w-4 h-4" /> Email Guru
              </label>
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  className="w-full bg-slate-800/50 text-white px-4 py-3.5 rounded-xl border border-white/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all outline-none placeholder-slate-500"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 ml-1">
                <KeyRound className="w-4 h-4" /> Password
              </label>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  className="w-full bg-slate-800/50 text-white px-4 py-3.5 rounded-xl border border-white/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all outline-none placeholder-slate-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 rounded-xl flex justify-center items-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 disabled:opacity-50 mt-2"
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

          <div className="mt-8 text-center text-slate-400 font-medium text-sm relative z-10">
            Belum memiliki akses? <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-bold underline decoration-emerald-500/30 underline-offset-4">Daftar sekarang</Link>
          </div>
        </div>
        
        <div className="text-center mt-6 text-slate-500 text-xs font-medium tracking-wider uppercase opacity-60 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-slate-500/50"></div>
          Dikembangkan oleh Asrulefen
          <div className="h-px w-8 bg-slate-500/50"></div>
        </div>
      </div>
    </div>
  );
}
