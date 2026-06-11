"use client";
import { useState, useEffect } from "react";
import { Save, KeyRound, FileUp, FileDown, UploadCloud } from "lucide-react";

export default function PengaturanPage() {
  const [settings, setSettings] = useState({
    openrouter_api_key: "",
    ai_model: "google/gemini-2.0-flash-001",
    nama_sekolah: "TK PGRI NUR IKHLAS",
    kop_1: "YAYASAN PEMBINA LEMBAGA PENDIDIKAN",
    kop_2: "PERSATUAN GURU REPUBLIK INDONESIA JAWA TIMUR",
    kop_3: "(YPLP PGRI JATIM) PERWAKILAN KABUPATEN TUBAN",
    kop_4: "TAMAN KANAK-KANAK PGRI NUR IKHLAS",
    kop_5: "DESA PRUNGGAHAN KULON KECAMATAN SEMANDING",
    kop_6: "NPSN : 20574036 Email: tkpgrinuriklas@gmail.com",
    nama_kepala_tk: "INDAH ROHMAWATI, S.Pd",
    npa_kepala_tk: "13101200816",
    nama_guru_kelas: "TUNIK LUSTARI, S.Pd",
    npa_guru_kelas: "13101200817",
    
    // Identitas Lembaga
    nama_tk_lembaga: "PGRI NUR IKHLAS",
    nss_npsn_lembaga: "004050603035 / 20574036",
    alamat_tk_lembaga: "DSN. MOJOKOPEK RT.01/RW.29",
    kode_pos_lembaga: "62381",
    desa_lembaga: "PRUNGGAHAN KULON",
    kec_lembaga: "SEMANDING",
    kab_lembaga: "TUBAN",
    prov_lembaga: "JAWA TIMUR",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingRaport, setUploadingRaport] = useState(false);
  const [uploadingDepan, setUploadingDepan] = useState(false);
  const [uploadingGabungan, setUploadingGabungan] = useState(false);

  useEffect(() => {
    fetch("/api/pengaturan").then(r => r.json()).then(data => {
      setSettings(prev => ({ ...prev, ...data }));
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch("/api/pengaturan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setIsLoading(false);
    alert("Pengaturan berhasil disimpan!");
  };

  const handleUploadTemplate = async (e: React.ChangeEvent<HTMLInputElement>, type: 'raport' | 'depan' | 'gabungan') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      alert("Hanya file .docx (Microsoft Word) yang diperbolehkan!");
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    if (type === 'raport') setUploadingRaport(true);
    else if (type === 'depan') setUploadingDepan(true);
    else setUploadingGabungan(true);

    try {
      const res = await fetch('/api/upload-template', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
      } else {
        alert("Gagal: " + data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengupload template.");
    } finally {
      if (type === 'raport') setUploadingRaport(false);
      else if (type === 'depan') setUploadingDepan(false);
      else setUploadingGabungan(false);
      e.target.value = ''; // reset input
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan Aplikasi</h1>
          <p className="text-slate-500">Konfigurasi API AI dan data sekolah</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">


        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-bold border-b pb-2 text-slate-700">Pengaturan AI (OpenRouter)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-emerald-700">OpenRouter API Key</label>
              <input 
                type="text" 
                className="w-full p-2 border-2 border-slate-200 rounded-lg" 
                value={settings.openrouter_api_key || ""} 
                onChange={e => setSettings({...settings, openrouter_api_key: e.target.value})}
                placeholder="Paste API Key OpenRouter di sini (sk-or-v1-...)..."
              />
              <p className="text-xs text-slate-500 mt-1">
                Dapatkan API key di <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenRouter.ai</a>. Kosongkan jika ingin pakai key bawaan.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-emerald-700">Model AI</label>
              <select 
                className="w-full p-2 border-2 border-slate-200 rounded-lg"
                value={settings.ai_model || "google/gemini-2.0-flash-001"}
                onChange={e => setSettings({...settings, ai_model: e.target.value})}
              >
                <option value="google/gemini-2.0-flash-001">Gemini 2.0 Flash (Paling Hemat & Direkomendasikan)</option>
                <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (Lebih Pintar)</option>
                <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B (Gratis)</option>
                <option value="mistralai/mistral-7b-instruct">Mistral 7B (Gratis)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Pilih model AI paling hemat token. Jika gagal, otomatis coba model lain.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-bold border-b pb-2 text-slate-700">Data Sekolah & Guru</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-emerald-700">Nama Sekolah (Biasa)</label>
              <input 
                type="text" 
                className="w-full p-2 border-2 border-slate-200 rounded-lg font-bold" 
                value={settings.nama_sekolah} 
                onChange={e => setSettings({...settings, nama_sekolah: e.target.value})} 
              />
            </div>
            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-bold mb-2 text-slate-700 border-b pb-2">Kop Raport (6 Baris)</label>
              <div className="space-y-2">
                <input type="text" className="w-full p-2 border rounded text-center text-sm" value={settings.kop_1} onChange={e => setSettings({...settings, kop_1: e.target.value})} placeholder="Baris 1" />
                <input type="text" className="w-full p-2 border rounded text-center text-sm" value={settings.kop_2} onChange={e => setSettings({...settings, kop_2: e.target.value})} placeholder="Baris 2" />
                <input type="text" className="w-full p-2 border rounded text-center text-sm" value={settings.kop_3} onChange={e => setSettings({...settings, kop_3: e.target.value})} placeholder="Baris 3" />
                <input type="text" className="w-full p-2 border rounded text-center font-bold text-lg text-emerald-700" value={settings.kop_4} onChange={e => setSettings({...settings, kop_4: e.target.value})} placeholder="Nama Lembaga" />
                <input type="text" className="w-full p-2 border rounded text-center text-sm" value={settings.kop_5} onChange={e => setSettings({...settings, kop_5: e.target.value})} placeholder="Alamat" />
                <input type="text" className="w-full p-2 border rounded text-center text-xs" value={settings.kop_6} onChange={e => setSettings({...settings, kop_6: e.target.value})} placeholder="Kontak / NPSN" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nama Kepala TK</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                value={settings.nama_kepala_tk} 
                onChange={e => setSettings({...settings, nama_kepala_tk: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NPA Kepala TK</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                value={settings.npa_kepala_tk} 
                onChange={e => setSettings({...settings, npa_kepala_tk: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nama Guru Kelas</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                value={settings.nama_guru_kelas} 
                onChange={e => setSettings({...settings, nama_guru_kelas: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NPA Guru Kelas</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                value={settings.npa_guru_kelas} 
                onChange={e => setSettings({...settings, npa_guru_kelas: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-bold border-b pb-2 text-slate-700">Identitas TK (Lembar Depan)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama TK</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.nama_tk_lembaga} onChange={e => setSettings({...settings, nama_tk_lembaga: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NSS / NPSN</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.nss_npsn_lembaga} onChange={e => setSettings({...settings, nss_npsn_lembaga: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Alamat TK</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.alamat_tk_lembaga} onChange={e => setSettings({...settings, alamat_tk_lembaga: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kode Pos</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.kode_pos_lembaga} onChange={e => setSettings({...settings, kode_pos_lembaga: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Desa / Kelurahan</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.desa_lembaga} onChange={e => setSettings({...settings, desa_lembaga: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kecamatan</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.kec_lembaga} onChange={e => setSettings({...settings, kec_lembaga: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kabupaten / Kota</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.kab_lembaga} onChange={e => setSettings({...settings, kab_lembaga: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Provinsi</label>
              <input type="text" className="w-full p-2 border rounded" value={settings.prov_lembaga} onChange={e => setSettings({...settings, prov_lembaga: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100 space-y-4">
          <div className="flex items-center space-x-2 border-b border-blue-200 pb-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-700">Kelola Template Word</h2>
          </div>
          <p className="text-sm text-slate-600">
            Anda dapat mendownload Master Template (berisi kode ajaib), mengeditnya di MS Word, lalu menguploadnya kembali agar bisa digunakan selamanya.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Template Isi Raport */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800">Master Isi Raport</h3>
                  <p className="text-xs text-slate-500 mt-1">Berisi tabel nilai, narasi AI, dan foto.</p>
                </div>
                <a href="/template_raport_v2.docx" download className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-full transition-colors" title="Download Master Template Raport">
                  <FileDown className="w-5 h-5" />
                </a>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".docx" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => handleUploadTemplate(e, 'raport')}
                  disabled={uploadingRaport}
                />
                <div className={`w-full p-3 border-2 border-dashed rounded-lg text-center transition-colors ${uploadingRaport ? 'bg-slate-100 border-slate-300' : 'border-blue-300 hover:bg-blue-50 cursor-pointer'}`}>
                  <span className="text-sm font-medium text-slate-600 flex items-center justify-center space-x-2">
                    <FileUp className="w-4 h-4" />
                    <span>{uploadingRaport ? 'Mengupload...' : 'Upload File Word Baru (.docx)'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Template Lembar Depan */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800">Master Lembar Identitas</h3>
                  <p className="text-xs text-slate-500 mt-1">Lembar depan berisi biodata siswa.</p>
                </div>
                <a href="/template_depan_v2.docx" download className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-full transition-colors" title="Download Master Template Identitas">
                  <FileDown className="w-5 h-5" />
                </a>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".docx" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => handleUploadTemplate(e, 'depan')}
                  disabled={uploadingDepan}
                />
                <div className={`w-full p-3 border-2 border-dashed rounded-lg text-center transition-colors ${uploadingDepan ? 'bg-slate-100 border-slate-300' : 'border-blue-300 hover:bg-blue-50 cursor-pointer'}`}>
                  <span className="text-sm font-medium text-slate-600 flex items-center justify-center space-x-2">
                    <FileUp className="w-4 h-4" />
                    <span>{uploadingDepan ? 'Mengupload...' : 'Upload File Word Baru (.docx)'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Template Gabungan */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col space-y-4 md:col-span-2 lg:col-span-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800">Master Template Gabungan</h3>
                  <p className="text-xs text-slate-500 mt-1">Gabungan Identitas dan Raport dalam 1 file.</p>
                </div>
                <a href="/template_gabungan_v2.docx" download className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-full transition-colors" title="Download Master Template Gabungan">
                  <FileDown className="w-5 h-5" />
                </a>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".docx" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => handleUploadTemplate(e, 'gabungan')}
                  disabled={uploadingGabungan}
                />
                <div className={`w-full p-3 border-2 border-dashed rounded-lg text-center transition-colors ${uploadingGabungan ? 'bg-slate-100 border-slate-300' : 'border-purple-300 hover:bg-purple-50 cursor-pointer'}`}>
                  <span className="text-sm font-medium text-slate-600 flex items-center justify-center space-x-2">
                    <FileUp className="w-4 h-4" />
                    <span>{uploadingGabungan ? 'Mengupload...' : 'Upload File Gabungan (.docx)'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 font-semibold shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{isLoading ? "Menyimpan..." : "Simpan Pengaturan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
