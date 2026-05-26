"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Download, Upload, FileSpreadsheet, Users } from "lucide-react";
import * as XLSX from "xlsx";

type Siswa = {
  id?: number;
  nama_lengkap: string;
  nama_panggilan: string;
  nisn: string;
  nipd: string;
  kelompok: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  agama: string;
  anak_ke: string;
  nama_ayah: string;
  nama_ibu: string;
  pekerjaan_ayah: string;
  pekerjaan_ibu: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  telepon: string;
};

const emptySiswa: Siswa = {
  nama_lengkap: "", nama_panggilan: "", nisn: "", nipd: "", kelompok: "A", jenis_kelamin: "Laki-laki",
  tempat_lahir: "", tanggal_lahir: "", agama: "Islam", anak_ke: "1", nama_ayah: "",
  nama_ibu: "", pekerjaan_ayah: "", pekerjaan_ibu: "", alamat: "",
  desa: "", kecamatan: "", kabupaten: "Tuban", provinsi: "Jawa Timur", telepon: ""
};

export default function SiswaPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Siswa>(emptySiswa);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const fetchSiswa = async () => {
    const res = await fetch("/api/siswa");
    if (res.ok) {
      setSiswa(await res.json());
    }
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = formData.id ? `/api/siswa/${formData.id}` : "/api/siswa";
    const method = formData.id ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    fetchSiswa();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus siswa ini?")) {
      await fetch(`/api/siswa/${id}`, { method: "DELETE" });
      fetchSiswa();
    }
  };

  const openModal = (s: Siswa | null = null) => {
    setFormData(s || emptySiswa);
    setIsModalOpen(true);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([emptySiswa]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Siswa");
    XLSX.writeFile(wb, "Template_Data_Siswa.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        if (data.length > 0) {
          // Normalize data keys (in case headers match our types)
          const res = await fetch("/api/siswa/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });
          
          if (res.ok) {
            alert("Data siswa berhasil di-import!");
            fetchSiswa();
          } else {
            const err = await res.json();
            alert("Gagal import: " + err.error);
          }
        }
      } catch (err) {
        alert("Gagal membaca file Excel. Pastikan format sesuai dengan template.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Data Siswa</h1>
          <p className="text-slate-500">Kelola identitas siswa TK PGRI Nur Ikhlas</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={downloadTemplate}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Template Excel</span>
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-sm font-medium">{isImporting ? "Mengimpor..." : "Upload Excel"}</span>
          </button>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          <button
            onClick={() => openModal()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Tambah Siswa</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">Kelompok</th>
                <th className="px-6 py-4 font-semibold">NISN</th>
                <th className="px-6 py-4 font-semibold">NIPD</th>
                <th className="px-6 py-4 font-semibold">L/P</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {siswa.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{s.nama_lengkap}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-700 text-xs font-bold">{s.kelompok}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">{s.nisn}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{s.nipd}</td>
                  <td className="px-6 py-4">{s.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openModal(s)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => s.id && handleDelete(s.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {siswa.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-flex flex-col items-center justify-center text-slate-400">
                      <Users className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-base font-medium text-slate-500">Belum ada data siswa</p>
                      <p className="text-sm mt-1">Gunakan template Excel untuk memasukkan data dengan cepat.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 mt-10 mb-10 border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">{formData.id ? "Edit Data Anak Didik" : "Tambah Anak Didik Baru"}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                  <input required type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Panggilan</label>
                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.nama_panggilan} onChange={e => setFormData({...formData, nama_panggilan: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">NISN</label>
                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.nisn} onChange={e => setFormData({...formData, nisn: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Induk / NIPD</label>
                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.nipd} onChange={e => setFormData({...formData, nipd: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kelompok</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.kelompok} onChange={e => setFormData({...formData, kelompok: e.target.value})}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jenis Kelamin</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.jenis_kelamin} onChange={e => setFormData({...formData, jenis_kelamin: e.target.value})}>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Agama</label>
                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.agama} onChange={e => setFormData({...formData, agama: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tempat Lahir</label>
                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.tempat_lahir} onChange={e => setFormData({...formData, tempat_lahir: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Lahir <span className="text-slate-400 font-normal">(16 Mei 2020)</span></label>
                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.tanggal_lahir} onChange={e => setFormData({...formData, tanggal_lahir: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Anak Ke-</label>
                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.anak_ke} onChange={e => setFormData({...formData, anak_ke: e.target.value})} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Data Orang Tua</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Ayah</label>
                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.nama_ayah} onChange={e => setFormData({...formData, nama_ayah: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Ibu</label>
                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.nama_ibu} onChange={e => setFormData({...formData, nama_ibu: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pekerjaan Ayah</label>
                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.pekerjaan_ayah} onChange={e => setFormData({...formData, pekerjaan_ayah: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pekerjaan Ibu</label>
                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.pekerjaan_ibu} onChange={e => setFormData({...formData, pekerjaan_ibu: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Jalan / Dusun</label>
                    <textarea className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" rows={2} value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} placeholder="Contoh: Jl. Diponegoro No. 10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Desa / Kelurahan</label>
                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.desa} onChange={e => setFormData({...formData, desa: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kecamatan</label>
                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.kecamatan} onChange={e => setFormData({...formData, kecamatan: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kabupaten / Kota</label>
                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.kabupaten} onChange={e => setFormData({...formData, kabupaten: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Provinsi</label>
                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.provinsi} onChange={e => setFormData({...formData, provinsi: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telepon (WA)</label>
                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.telepon} onChange={e => setFormData({...formData, telepon: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
