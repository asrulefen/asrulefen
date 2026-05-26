"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

type Indikator = {
  id?: number;
  kategori: string;
  deskripsi: string;
  urutan: number;
};

const kategoriList = ["AGAMA", "JATI_DIRI", "LITERASI", "PROJEK"];

export default function IndikatorPage() {
  const [indikator, setIndikator] = useState<Indikator[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Indikator>({ kategori: "AGAMA", deskripsi: "", urutan: 1 });

  const fetchIndikator = async () => {
    const res = await fetch("/api/indikator");
    if (res.ok) {
      setIndikator(await res.json());
    }
  };

  useEffect(() => {
    fetchIndikator();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = formData.id ? `/api/indikator/${formData.id}` : "/api/indikator";
    const method = formData.id ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    fetchIndikator();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus indikator ini?")) {
      await fetch(`/api/indikator/${id}`, { method: "DELETE" });
      fetchIndikator();
    }
  };

  const openModal = (ind: Indikator | null = null) => {
    setFormData(ind || { kategori: "AGAMA", deskripsi: "", urutan: 1 });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Indikator Penilaian</h1>
          <p className="text-slate-500">Kelola acuan indikator sesuai dengan kurikulum saat ini</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Indikator</span>
        </button>
      </div>

      <div className="space-y-8">
        {kategoriList.map(kategori => {
          const items = indikator.filter(i => i.kategori === kategori);
          if (items.length === 0) return null;
          
          return (
            <div key={kategori} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 font-bold text-slate-700">
                {kategori.replace("_", " ")}
              </div>
              <ul className="divide-y divide-slate-100">
                {items.map(item => (
                  <li key={item.id} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-400 font-mono">{item.urutan}</span>
                      <span className="text-slate-800 font-medium">{item.deskripsi}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => item.id && handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Indikator" : "Tambah Indikator"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select className="w-full p-2 border rounded" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                  {kategoriList.map(k => <option key={k} value={k}>{k.replace("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi Indikator</label>
                <textarea required className="w-full p-2 border rounded" rows={3} value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Urutan</label>
                <input required type="number" className="w-full p-2 border rounded" value={formData.urutan} onChange={e => setFormData({...formData, urutan: parseInt(e.target.value)})} />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-slate-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
