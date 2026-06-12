"use client";
import { useState, useEffect } from "react";
import { Image as ImageIcon, Loader2, Plus, X } from "lucide-react";
import { ImageCropper } from "@/components/ImageCropper";

export default function BankFotoPage() {
  const [semester, setSemester] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const [fotos, setFotos] = useState<{ [key: string]: string[] }>({
    agama: [],
    jati_diri: [],
    literasi: [],
    projek: []
  });
  const [fotoIds, setFotoIds] = useState<{ [key: string]: number[] }>({
    agama: [],
    jati_diri: [],
    literasi: [],
    projek: []
  });
  const [activeCropCategory, setActiveCropCategory] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/foto-kegiatan?semester=${semester}`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        const grouped: { [key: string]: string[] } = { agama: [], jati_diri: [], literasi: [], projek: [] };
        const groupedIds: { [key: string]: number[] } = { agama: [], jati_diri: [], literasi: [], projek: [] };
        data.forEach((row: any) => {
          if (grouped[row.kategori]) {
            grouped[row.kategori].push(row.foto_base64);
            groupedIds[row.kategori].push(row.id);
          }
        });
        setFotos(grouped);
        setFotoIds(groupedIds);
      }
      setIsLoading(false);
    }).catch(e => {
      console.error("Gagal load foto:", e);
      setIsLoading(false);
    });
  }, [semester]);

  const removeFoto = async (category: string, index: number) => {
    if (!confirm("Hapus foto ini? Foto ini akan terhapus dari semua raport di semester ini.")) return;
    
    const dbId = fotoIds[category]?.[index];
    if (dbId) {
      await fetch(`/api/foto-kegiatan?id=${dbId}`, { method: 'DELETE' });
      setFotoIds(prev => {
        const newIds = [...prev[category]];
        newIds.splice(index, 1);
        return { ...prev, [category]: newIds };
      });
    }
    setFotos(prev => {
      const newArr = [...prev[category]];
      newArr.splice(index, 1);
      return { ...prev, [category]: newArr };
    });
  };

  const renderSection = (title: string, category: string) => {
    const list = fotos[category] || [];
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
          <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            {list.length} / 9 Foto
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {list.map((base64, idx) => (
            <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={base64} className="w-full h-full object-cover" alt="Kegiatan" />
              <button
                onClick={() => removeFoto(category, idx)}
                className="absolute top-1 right-1 bg-white/90 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {list.length < 9 && (
            <button
              onClick={() => setActiveCropCategory(category)}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">Tambah</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-emerald-600" />
            Bank Foto Kegiatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Upload foto kegiatan per semester di sini. Foto otomatis muncul di pengisian raport semua siswa.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="w-full p-2.5 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 focus:border-emerald-500"
            value={semester}
            onChange={e => setSemester(e.target.value)}
          >
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mr-3" />
          <span className="text-slate-500 font-medium">Memuat bank foto...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {renderSection("Nilai Agama, Moral & Budi Pekerti", "agama")}
          {renderSection("Jati Diri", "jati_diri")}
          {renderSection("Dasar-dasar Literasi & STEAM", "literasi")}
          {renderSection("Projek / Kokurikuler", "projek")}
        </div>
      )}

      {activeCropCategory && (
        <ImageCropper 
          onCropComplete={async (result) => {
            if (result) {
              const newPhotos = Array.isArray(result) ? result : [result];
              const cat = activeCropCategory;
              
              setFotos(prev => {
                const newArr = [...prev[cat], ...newPhotos].slice(0, 9);
                return { ...prev, [cat]: newArr };
              });
              
              try {
                const res = await fetch('/api/foto-kegiatan', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ kategori: cat, semester, fotos: newPhotos })
                });
                const data = await res.json();
                if (data.insertedIds) {
                  setFotoIds(prev => ({
                    ...prev,
                    [cat]: [...prev[cat], ...data.insertedIds]
                  }));
                }
              } catch (e) {
                console.error('Gagal simpan foto:', e);
              }
            }
            setActiveCropCategory(null);
          }}  
          aspect={4/3} 
        />
      )}
    </div>
  );
}
