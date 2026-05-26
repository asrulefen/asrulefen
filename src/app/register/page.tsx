"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        alert("Pendaftaran berhasil! Silakan masuk.");
        router.push("/login");
      } else {
        setError(data.error || "Gagal mendaftar");
      }
    } catch (e) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800">Daftar Akun</h1>
          <p className="text-slate-500 mt-2 font-medium">Bergabung untuk Kelola Raport Siswa</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-semibold text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap Guru</label>
            <input 
              type="text" 
              required
              className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-0 transition-colors font-medium"
              placeholder="Ibu Guru..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-0 transition-colors font-medium"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-0 transition-colors font-medium"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex justify-center items-center transition-all shadow-lg shadow-emerald-600/30 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Buat Akun Sekarang"}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 font-medium text-sm">
          Sudah punya akun? <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold">Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
}
