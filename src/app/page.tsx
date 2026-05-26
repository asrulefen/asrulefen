"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, FileText, ListChecks, ArrowRight, Sparkles, BookOpen } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({ siswa: 0, indikator: 0 });
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startYear = currentMonth < 6 ? currentYear - 1 : currentYear;
  const tahunAjaran = `${startYear}/${startYear + 1}`;

  useEffect(() => {
    Promise.all([
      fetch("/api/siswa").then(r => r.json()),
      fetch("/api/indikator").then(r => r.json())
    ]).then(([siswaData, indikatorData]) => {
      setStats({
        siswa: siswaData.length || 0,
        indikator: indikatorData.length || 0
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-3 sm:space-y-10 pb-20 sm:pb-20 h-full flex flex-col justify-center">
      
      {/* Animated Developed By Badge */}
      <div className="flex justify-center mb-1 sm:mb-0">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-sm font-bold shadow-md animate-pulse">
          <span>Dikembangkan oleh</span>
          <span className="text-yellow-300 relative inline-block">
            <span className="animate-bounce inline-block">a</span>
            <span className="animate-bounce inline-block" style={{animationDelay: "0.1s"}}>s</span>
            <span className="animate-bounce inline-block" style={{animationDelay: "0.2s"}}>r</span>
            <span className="animate-bounce inline-block" style={{animationDelay: "0.3s"}}>u</span>
            <span className="animate-bounce inline-block" style={{animationDelay: "0.4s"}}>l</span>
            <span className="animate-bounce inline-block" style={{animationDelay: "0.5s"}}>e</span>
            <span className="animate-bounce inline-block" style={{animationDelay: "0.6s"}}>f</span>
            <span className="animate-bounce inline-block" style={{animationDelay: "0.7s"}}>e</span>
            <span className="animate-bounce inline-block" style={{animationDelay: "0.8s"}}>n</span>
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl sm:rounded-3xl p-4 sm:p-10 text-white shadow-xl flex flex-row items-center">
        <div className="relative z-10 w-2/3 sm:w-full">
          <div className="hidden sm:inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Sistem Raport Cerdas AI</span>
          </div>
          <h1 className="text-lg sm:text-5xl font-extrabold mb-1 sm:mb-4 leading-tight">
            Raport Pintar TK
          </h1>
          <p className="text-emerald-50 max-w-2xl text-[10px] sm:text-lg font-medium opacity-95 leading-tight">
            Kelola nilai, narasi AI, dan cetak raport sekali klik.
          </p>
        </div>
        
        {/* Animated SVG Graphic */}
        <div className="w-1/3 sm:absolute sm:right-10 sm:top-1/2 sm:-translate-y-1/2 flex justify-end z-10">
          <svg className="w-16 h-16 sm:w-48 sm:h-48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g className="animate-[spin_10s_linear_infinite]">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="5,5" />
            </g>
            <rect x="25" y="20" width="50" height="60" rx="5" fill="rgba(255,255,255,0.9)" className="animate-[bounce_3s_ease-in-out_infinite]" />
            <rect x="35" y="30" width="30" height="4" rx="2" fill="#0d9488" className="animate-pulse" />
            <rect x="35" y="40" width="20" height="4" rx="2" fill="#0d9488" className="animate-pulse" style={{animationDelay: "0.2s"}} />
            <rect x="35" y="50" width="25" height="4" rx="2" fill="#0d9488" className="animate-pulse" style={{animationDelay: "0.4s"}} />
            <path d="M40 70 L45 75 L60 60" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
          </svg>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-6">
        <div className="bg-white p-2 sm:p-6 rounded-xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:space-x-5 text-center sm:text-left">
          <div className="w-8 h-8 sm:w-16 sm:h-16 bg-blue-100 text-blue-600 rounded-lg sm:rounded-2xl flex items-center justify-center mb-1 sm:mb-0">
            <Users className="w-4 h-4 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-[8px] sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">Anak Didik</h2>
            <p className="text-lg sm:text-3xl font-black text-slate-800 leading-none">{stats.siswa}</p>
          </div>
        </div>
        
        <div className="bg-white p-2 sm:p-6 rounded-xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:space-x-5 text-center sm:text-left">
          <div className="w-8 h-8 sm:w-16 sm:h-16 bg-amber-100 text-amber-600 rounded-lg sm:rounded-2xl flex items-center justify-center mb-1 sm:mb-0">
            <ListChecks className="w-4 h-4 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-[8px] sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">Indikator</h2>
            <p className="text-lg sm:text-3xl font-black text-slate-800 leading-none">{stats.indikator}</p>
          </div>
        </div>

        <div className="bg-white p-2 sm:p-6 rounded-xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:space-x-5 text-center sm:text-left">
          <div className="w-8 h-8 sm:w-16 sm:h-16 bg-purple-100 text-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center mb-1 sm:mb-0">
            <BookOpen className="w-4 h-4 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-[8px] sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">Thn Ajaran</h2>
            <p className="text-xs sm:text-2xl font-black text-slate-800 leading-none mt-1 sm:mt-0">{tahunAjaran}</p>
          </div>
        </div>
      </div>

      {/* Menu Cepat */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-8">
        <Link href="/siswa" className="group relative block bg-white p-3 sm:p-8 rounded-xl sm:rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all overflow-hidden text-center sm:text-left">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-32 sm:h-32 bg-blue-50 rounded-bl-[50px] sm:rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-8 h-8 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto sm:mx-0 mb-2 sm:mb-6 shadow-sm">
            <Users className="w-4 h-4 sm:w-7 sm:h-7" />
          </div>
          <h3 className="font-bold text-[11px] sm:text-2xl text-slate-800 mb-1 sm:mb-3">Kelola Anak</h3>
          <p className="hidden sm:block text-slate-500 font-medium leading-relaxed">Masukkan data identitas anak didik baru, edit data lama, atau perbarui profil orang tua.</p>
        </Link>
        
        <Link href="/raport" className="group relative block bg-white p-3 sm:p-8 rounded-xl sm:rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all overflow-hidden text-center sm:text-left">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-32 sm:h-32 bg-emerald-50 rounded-bl-[50px] sm:rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-8 h-8 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto sm:mx-0 mb-2 sm:mb-6 shadow-sm">
            <FileText className="w-4 h-4 sm:w-7 sm:h-7" />
          </div>
          <h3 className="font-bold text-[11px] sm:text-2xl text-slate-800 mb-1 sm:mb-3">Isi Raport</h3>
          <p className="hidden sm:block text-slate-500 font-medium leading-relaxed">Menu utama untuk menilai perkembangan anak, upload foto, membuat narasi AI, dan cetak.</p>
        </Link>
      </div>

      {/* Panduan Step-by-step (Hidden on very small screens, visible on md) */}
      <div className="hidden sm:block bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100 shadow-sm mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-emerald-600" />
          Panduan Langkah Demi Langkah
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform z-10">1</div>
            <div className="hidden md:block absolute top-6 left-[50%] w-full h-[3px] bg-emerald-200 -z-0"></div>
            <h3 className="font-bold text-slate-800 mb-2">Input Identitas</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">Buka menu <b>Data Anak</b>, lalu masukkan identitas lengkap siswa yang akan dinilai.</p>
          </div>
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform z-10">2</div>
            <div className="hidden md:block absolute top-6 left-[50%] w-full h-[3px] bg-emerald-200 -z-0"></div>
            <h3 className="font-bold text-slate-800 mb-2">Pilih & Nilai</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">Ke menu <b>Isi Raport</b>, pilih nama siswa, lalu pilih nilai (Muncul/Belum Muncul) di tiap poin.</p>
          </div>
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform z-10">3</div>
            <div className="hidden md:block absolute top-6 left-[50%] w-full h-[3px] bg-emerald-200 -z-0"></div>
            <h3 className="font-bold text-slate-800 mb-2">Generate AI & Foto</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">Klik tombol ungu <b>Generate AI</b> untuk membuat cerita otomatis, lalu klik <b>Tambah Foto</b>.</p>
          </div>
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform z-10">4</div>
            <h3 className="font-bold text-slate-800 mb-2">Download Word</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">Gulir ke paling atas, klik <b>Cetak Isi Raport</b>. File siap diprint!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
