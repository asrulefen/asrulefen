"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, Ruler, Weight, HeartPulse } from "lucide-react";

interface SiswaData {
  id: number;
  nama_lengkap: string;
  tinggi: string;
  berat: string;
  sakit: string;
  izin: string;
  tanpa_keterangan: string;
}

export default function DataFisikPage() {
  const [siswaList, setSiswaList] = useState<SiswaData[]>([]);
  const [semester, setSemester] = useState("1");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load siswa list + existing data
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch("/api/siswa").then(r => r.json()),
      fetch(`/api/data-fisik?semester=${semester}`).then(r => r.json()),
    ]).then(([siswa, dataFisik]) => {
      if (!Array.isArray(siswa)) { setIsLoading(false); return; }
      
      // Map existing data to siswa
      const dataMap = new Map();
      if (Array.isArray(dataFisik)) {
        dataFisik.forEach((d: any) => dataMap.set(Number(d.siswa_id), d));
      }

      const merged = siswa.map((s: any) => {
        const existing = dataMap.get(s.id);
        return {
          id: s.id,
          nama_lengkap: s.nama_lengkap,
          tinggi: existing?.tinggi || "",
          berat: existing?.berat || "",
          sakit: existing?.sakit || "0",
          izin: existing?.izin || "0",
          tanpa_keterangan: existing?.tanpa_keterangan || "0",
        };
      });
      setSiswaList(merged);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [semester]);

  const updateField = (index: number, field: keyof SiswaData, value: string) => {
    setSiswaList(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload = siswaList.map(s => ({
        siswa_id: s.id,
        semester,
        tinggi: s.tinggi,
        berat: s.berat,
        sakit: s.sakit,
        izin: s.izin,
        tanpa_keterangan: s.tanpa_keterangan,
      }));
      const res = await fetch("/api/data-fisik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setLastSaved(new Date().toLocaleTimeString("id-ID"));
        alert("✅ Data berhasil disimpan untuk semua siswa!");
      } else {
        const data = await res.json();
        alert("Gagal: " + data.error);
      }
    } catch (e) {
      alert("Gagal menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-emerald-600" />
            Data Fisik & Kehadiran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Isi data BB, TB, dan kehadiran semua siswa sekaligus. Data ini otomatis terpakai saat cetak raport.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            className="p-2.5 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 focus:border-emerald-500"
            value={semester}
            onChange={e => setSemester(e.target.value)}
          >
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
          <button
            onClick={handleSaveAll}
            disabled={isSaving || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center font-bold shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 disabled:opacity-50 whitespace-nowrap"
          >
            {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Simpan Semua
          </button>
        </div>
      </div>

      {lastSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium">
          ✅ Terakhir disimpan: {lastSaved}
        </div>
      )}

      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mr-3" />
          <span className="text-slate-500 font-medium">Memuat data siswa...</span>
        </div>
      ) : siswaList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500">
          Belum ada data siswa. Silakan tambah siswa terlebih dahulu di menu Data Siswa.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-bold text-slate-700 text-sm w-8">No</th>
                  <th className="text-left p-4 font-bold text-slate-700 text-sm">Nama Siswa</th>
                  <th className="text-center p-4 font-bold text-slate-700 text-sm w-24">
                    <div className="flex items-center justify-center gap-1"><Ruler className="w-4 h-4" />TB (cm)</div>
                  </th>
                  <th className="text-center p-4 font-bold text-slate-700 text-sm w-24">
                    <div className="flex items-center justify-center gap-1"><Weight className="w-4 h-4" />BB (kg)</div>
                  </th>
                  <th className="text-center p-4 font-bold text-slate-700 text-sm w-20">Sakit</th>
                  <th className="text-center p-4 font-bold text-slate-700 text-sm w-20">Izin</th>
                  <th className="text-center p-4 font-bold text-slate-700 text-sm w-20">Alpa</th>
                </tr>
              </thead>
              <tbody>
                {siswaList.map((s, i) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-400 font-bold">{i + 1}</td>
                    <td className="p-4 text-sm font-semibold text-slate-800">{s.nama_lengkap}</td>
                    <td className="p-2">
                      <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center font-medium focus:border-emerald-500 transition-colors" value={s.tinggi} onChange={e => updateField(i, "tinggi", e.target.value)} placeholder="-" />
                    </td>
                    <td className="p-2">
                      <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center font-medium focus:border-emerald-500 transition-colors" value={s.berat} onChange={e => updateField(i, "berat", e.target.value)} placeholder="-" />
                    </td>
                    <td className="p-2">
                      <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center font-medium focus:border-emerald-500 transition-colors" value={s.sakit} onChange={e => updateField(i, "sakit", e.target.value)} placeholder="0" />
                    </td>
                    <td className="p-2">
                      <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center font-medium focus:border-emerald-500 transition-colors" value={s.izin} onChange={e => updateField(i, "izin", e.target.value)} placeholder="0" />
                    </td>
                    <td className="p-2">
                      <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center font-medium focus:border-emerald-500 transition-colors" value={s.tanpa_keterangan} onChange={e => updateField(i, "tanpa_keterangan", e.target.value)} placeholder="0" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-slate-100">
            {siswaList.map((s, i) => (
              <div key={s.id} className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="font-bold text-slate-800 text-sm">{s.nama_lengkap}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">TB (cm)</label>
                    <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center text-sm font-medium focus:border-emerald-500" value={s.tinggi} onChange={e => updateField(i, "tinggi", e.target.value)} placeholder="-" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">BB (kg)</label>
                    <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center text-sm font-medium focus:border-emerald-500" value={s.berat} onChange={e => updateField(i, "berat", e.target.value)} placeholder="-" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Sakit</label>
                    <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center text-sm font-medium focus:border-emerald-500" value={s.sakit} onChange={e => updateField(i, "sakit", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Izin</label>
                    <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center text-sm font-medium focus:border-emerald-500" value={s.izin} onChange={e => updateField(i, "izin", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Alpa</label>
                    <input type="text" className="w-full p-2 border-2 border-slate-200 rounded-lg text-center text-sm font-medium focus:border-emerald-500" value={s.tanpa_keterangan} onChange={e => updateField(i, "tanpa_keterangan", e.target.value)} placeholder="0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
