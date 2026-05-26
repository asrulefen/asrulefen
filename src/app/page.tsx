"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, FileText, ListChecks, ArrowRight, Sparkles, BookOpen } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({ siswa: 0, indikator: 0 });

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
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-10 text-white shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Sistem Raport Cerdas AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Selamat Datang di <br /> Raport Pintar TK PGRI
          </h1>
          <p className="text-emerald-50 max-w-2xl text-lg font-medium opacity-95">
            Aplikasi ini dibuat khusus untuk mempermudah Bapak/Ibu Guru dalam mengelola nilai, menulis narasi otomatis dengan AI, dan mencetak raport anak didik dengan sekali klik.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Anak Didik</h2>
            <p className="text-3xl font-black text-slate-800">{stats.siswa} <span className="text-base font-medium text-slate-500">Siswa</span></p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
            <ListChecks className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Indikator Nilai</h2>
            <p className="text-3xl font-black text-slate-800">{stats.indikator} <span className="text-base font-medium text-slate-500">Poin</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Tahun Ajaran</h2>
            <p className="text-2xl font-black text-slate-800">2025/2026</p>
          </div>
        </div>
      </div>

      {/* Panduan Step-by-step */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100 shadow-sm mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-emerald-600" />
          Panduan Langkah Demi Langkah
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform z-10">1</div>
            <div className="hidden md:block absolute top-6 left-[50%] w-full h-[3px] bg-emerald-200 -z-0"></div>
            <h3 className="font-bold text-slate-800 mb-2">Input Identitas</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">Buka menu <b>Data Anak</b>, lalu masukkan identitas lengkap siswa yang akan dinilai.</p>
          </div>
          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform z-10">2</div>
            <div className="hidden md:block absolute top-6 left-[50%] w-full h-[3px] bg-emerald-200 -z-0"></div>
            <h3 className="font-bold text-slate-800 mb-2">Pilih & Nilai</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">Ke menu <b>Isi Raport</b>, pilih nama siswa, lalu pilih nilai (Muncul/Belum Muncul) di tiap poin.</p>
          </div>
          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform z-10">3</div>
            <div className="hidden md:block absolute top-6 left-[50%] w-full h-[3px] bg-emerald-200 -z-0"></div>
            <h3 className="font-bold text-slate-800 mb-2">Generate AI & Foto</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">Klik tombol ungu <b>Generate AI</b> untuk membuat cerita otomatis, lalu klik <b>Tambah Foto</b>.</p>
          </div>
          {/* Step 4 */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform z-10">4</div>
            <h3 className="font-bold text-slate-800 mb-2">Download Word</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">Gulir ke paling atas, klik <b>Cetak Isi Raport</b>. File siap diprint!</p>
          </div>
        </div>
      </div>

      {/* Menu Cepat */}
      <div className="pt-4">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          Mulai Bekerja
          <div className="h-1 flex-1 bg-slate-100 ml-4 rounded-full"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/siswa" className="group relative block bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Users className="w-7 h-7" />
            </div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-2xl text-slate-800">Kelola Data Anak</h3>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <ArrowRight className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">Masukkan data identitas anak didik baru, edit data lama, atau perbarui profil orang tua. Data ini akan otomatis masuk ke lembar depan raport.</p>
          </Link>
          
          <Link href="/raport" className="group relative block bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <FileText className="w-7 h-7" />
            </div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-2xl text-slate-800">Isi Raport & Cetak</h3>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <ArrowRight className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">Menu utama untuk menilai perkembangan anak, upload foto secara praktis, membuat narasi otomatis dengan AI, dan mendownload dokumen Word siap cetak.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
