"use client";
import { useState, useEffect } from "react";
import { ImageCropper } from "@/components/ImageCropper";
import { Download, Wand2, Loader2, Plus, PlayCircle } from "lucide-react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function RaportPage() {
  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [indikatorList, setIndikatorList] = useState<any[]>([]);
  
  const [selectedSiswa, setSelectedSiswa] = useState<string>("");
  const [tinggi, setTinggi] = useState("");
  const [berat, setBerat] = useState("");
  const [sakit, setSakit] = useState("0");
  const [izin, setIzin] = useState("0");
  const [tanpaKeterangan, setTanpaKeterangan] = useState("0");
  const [semester, setSemester] = useState("I / 2025-2026");
  const [tanggalRaport, setTanggalRaport] = useState("Tuban, 20 Desember 2026");
  const [tanggalIdentitas, setTanggalIdentitas] = useState("Tuban, 14 Juli 2025");

  const [nilai, setNilai] = useState<Record<number, string>>({});
  const [teks, setTeks] = useState({ agama: "", jatiDiri: "", literasi: "", projek: "" });
  const [isGenerating, setIsGenerating] = useState({ agama: false, jatiDiri: false, literasi: false, projek: false });
  
  // State foto dinamis per kategori (array of base64 strings), maks 9
  const [fotos, setFotos] = useState<{ [key: string]: string[] }>({
    agama: [],
    jati_diri: [],
    literasi: [],
    projek: []
  });
  const [activeCropCategory, setActiveCropCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/siswa").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setSiswaList(data);
      else console.error("Error fetching siswa:", data);
    });
    fetch("/api/indikator").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setIndikatorList(data);
      else console.error("Error fetching indikator:", data);
    });
    fetch("/api/pengaturan").then(r => r.json()).then(data => {
      if (data.semester) setSemester(data.semester);
      if (data.tanggal_raport) setTanggalRaport(data.tanggal_raport);
      if (data.tanggal_identitas) setTanggalIdentitas(data.tanggal_identitas);
    });
  }, []);

  const savePengaturan = async (key: string, value: string) => {
    try {
      await fetch("/api/pengaturan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value })
      });
    } catch (e) {
      console.error("Gagal menyimpan pengaturan", e);
    }
  };

  const startTutorial = () => {
    const driverObj = driver({
      showProgress: true,
      nextBtnText: 'Selanjutnya ➔',
      prevBtnText: '⬅ Sebelumnya',
      doneBtnText: 'Selesai!',
      steps: [
        { element: '#step-pilih-siswa', popover: { title: 'Langkah 1: Pilih Siswa', description: 'Pertama-tama, klik kotak ini dan pilih nama anak yang ingin Anda buatkan raportnya.', side: "left", align: 'start' }},
        { element: '#step-nilai-indikator', popover: { title: 'Langkah 2: Beri Nilai', description: 'Pilih nilai untuk setiap poin perkembangan anak (contoh: Sudah Muncul / Belum Muncul).', side: "bottom", align: 'start' }},
        { element: '#step-generate-ai', popover: { title: 'Langkah 3: Buat Narasi Otomatis', description: 'Klik tombol ungu ini! Kecerdasan Buatan (AI) akan otomatis merangkaikan kata-kata indah berdasarkan nilai yang baru saja Anda pilih.', side: "top", align: 'start' }},
        { element: '#step-tambah-foto', popover: { title: 'Langkah 4: Masukkan Foto', description: 'Klik kotak putus-putus ini untuk memilih foto kegiatan anak dari komputer/HP Anda.', side: "top", align: 'start' }},
        { element: '#step-cetak-raport', popover: { title: 'Langkah Terakhir: Cetak!', description: 'Jika semua sudah terisi, klik tombol hijau ini untuk langsung mendownload file Microsoft Word yang sudah jadi dan siap diprint. Selesai!', side: "bottom", align: 'start' }}
      ]
    });
    driverObj.drive();
  };

  const handleGenerateNarasi = async (kategoriMap: string, kategoriKey: keyof typeof teks) => {
    if (!selectedSiswa) return alert("Pilih siswa terlebih dahulu");
    
    setIsGenerating(prev => ({ ...prev, [kategoriKey]: true }));
    try {
      const siswa = siswaList.find(s => s.id.toString() === selectedSiswa);
      const kIndikator = indikatorList.filter(i => i.kategori === kategoriMap);
      const indikatorData = kIndikator.map(i => ({
        deskripsi: i.deskripsi,
        nilai: nilai[i.id] || "Belum Dinilai"
      }));

      const res = await fetch("/api/generate-narasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kategori: kategoriMap, namaSiswa: siswa.nama_panggilan || siswa.nama_lengkap, indikatorData })
      });
      
      const data = await res.json();
      if (res.ok) {
        setTeks(prev => ({ ...prev, [kategoriKey]: data.text }));
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Gagal menghubungi AI");
    } finally {
      setIsGenerating(prev => ({ ...prev, [kategoriKey]: false }));
    }
  };

  const handleDownloadDocx = async (type: 'identitas' | 'raport' | 'gabungan') => {
    if (!selectedSiswa) return alert("Pilih siswa terlebih dahulu");
    
    try {
      const res = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siswaId: selectedSiswa,
          semester,
          tanggalRaport,
          tanggalIdentitas,
          tinggi, berat, sakit, izin, tanpaKeterangan,
          teks,
          fotos
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Use Blob instead of data URI to prevent truncation of large files
        const base64Data = type === 'identitas' ? data.depanBase64 : (type === 'gabungan' ? data.gabunganBase64 : data.raportBase64);
        const filename = type === 'identitas' ? `Identitas_${data.filename}` : (type === 'gabungan' ? `Lengkap_${data.filename}` : data.filename);
        
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Gagal mengunduh raport");
    }
  };

  const removeFoto = (category: string, index: number) => {
    setFotos(prev => {
      const newArr = [...prev[category]];
      newArr.splice(index, 1);
      return { ...prev, [category]: newArr };
    });
  };

  const renderSection = (title: string, kategoriMap: string, kategoriKey: keyof typeof teks, photoCategory: string) => {
    const kIndikator = indikatorList.filter(i => i.kategori === kategoriMap);
    const currentFotos = fotos[photoCategory] || [];
    const maxFotos = 9;
    
    return (
      <div className="bg-white p-2.5 sm:p-8 rounded-xl sm:rounded-3xl shadow-sm border border-slate-200 mt-3 sm:mt-8 space-y-3 sm:space-y-8">
        <h2 className="text-lg sm:text-2xl font-bold text-slate-800 border-b border-slate-100 pb-1.5 sm:pb-4">{title}</h2>
        
        {/* Indikator Selection */}
        <div className="space-y-1.5 sm:space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-8 sm:h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-base">1</div>
            <h3 className="font-bold text-slate-700 text-sm sm:text-lg">Penilaian Indikator</h3>
          </div>
          <div id={kategoriKey === 'agama' ? 'step-nilai-indikator' : ''} className="bg-slate-50 p-2 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 space-y-1 sm:space-y-3">
            {kIndikator.map(ind => (
              <div key={ind.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-3 border-b border-slate-200 pb-1.5 sm:pb-3 last:border-0 last:pb-0">
                <span className="text-[11px] sm:text-sm font-medium text-slate-700 w-full sm:w-1/2 leading-tight">{ind.deskripsi}</span>
                <select 
                  className="p-1 sm:p-2.5 text-[11px] sm:text-sm border-2 border-slate-200 rounded-lg sm:rounded-xl w-full sm:w-1/2 focus:ring-0 focus:border-emerald-500 transition-colors font-medium text-slate-700"
                  value={nilai[ind.id] || ""}
                  onChange={(e) => setNilai(prev => ({...prev, [ind.id]: e.target.value}))}
                >
                  <option value="">-- Pilih Nilai --</option>
                  <option value="Belum Muncul">Belum Muncul</option>
                  <option value="Muncul Sebagian Besar">Muncul Sebagian Besar</option>
                  <option value="Sudah Muncul">Sudah Muncul</option>
                  <option value="Berkembang Sangat Baik">Berkembang Sangat Baik</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* AI Generator */}
        <div className="space-y-2 sm:space-y-4">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 sm:w-8 sm:h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-base">2</div>
              <h3 className="font-bold text-slate-700 text-sm sm:text-lg">Narasi Perkembangan</h3>
            </div>
            <button 
              id={kategoriKey === 'agama' ? 'step-generate-ai' : ''}
              onClick={() => handleGenerateNarasi(kategoriMap, kategoriKey)}
              disabled={isGenerating[kategoriKey]}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-base flex items-center shadow-md disabled:opacity-50 transition-all active:scale-95"
            >
              {isGenerating[kategoriKey] ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />}
              Generate AI Narasi
            </button>
          </div>
          <textarea 
            rows={4}
            className="w-full p-2.5 sm:p-4 text-xs sm:text-base border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:ring-0 focus:border-purple-500 transition-colors leading-relaxed text-slate-700 font-medium"
            value={teks[kategoriKey]}
            onChange={e => setTeks(prev => ({ ...prev, [kategoriKey]: e.target.value }))}
            placeholder="Klik tombol Generate AI atau ketik narasi secara manual di sini..."
          />
        </div>

        {/* Photos (Dynamic 1 to 9) */}
        <div className="space-y-1.5 sm:space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-8 sm:h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-base">3</div>
            <h3 className="font-bold text-slate-700 text-sm sm:text-lg">Foto <span className="text-slate-400 font-normal text-[10px] sm:text-sm">(Maks 9)</span></h3>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {currentFotos.map((foto, index) => (
              <div key={index} className="relative group w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm">
                <img src={foto} alt={`Foto ${index+1}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeFoto(photoCategory, index)}
                  className="absolute inset-0 bg-red-600/80 text-white font-bold opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all backdrop-blur-sm"
                >
                  <span>Hapus Foto</span>
                </button>
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-md">
                  {index + 1}
                </div>
              </div>
            ))}

            {currentFotos.length < maxFotos && (
              <button 
                id={kategoriKey === 'agama' ? 'step-tambah-foto' : ''}
                onClick={() => setActiveCropCategory(photoCategory)}
                className="w-full aspect-[4/3] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">Tambah Foto</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 sticky top-4 z-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">Input Raport</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Pilih siswa, nilai, generate AI, tambah foto.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0 flex-wrap justify-end">
          <button
            onClick={() => handleDownloadDocx('identitas')}
            className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-2xl flex items-center justify-center space-x-2 font-bold shadow-lg shadow-sky-600/30 transition-transform active:scale-95 text-sm whitespace-nowrap"
          >
            <Download className="w-5 h-5" />
            <span>Cetak Identitas</span>
          </button>
          <button
            id="step-cetak-raport"
            onClick={() => handleDownloadDocx('raport')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl flex items-center justify-center space-x-2 font-bold shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 text-sm whitespace-nowrap"
          >
            <Download className="w-5 h-5" />
            <span>Cetak Isi Raport</span>
          </button>
          <button
            onClick={() => handleDownloadDocx('gabungan')}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-2xl flex items-center justify-center space-x-2 font-bold shadow-lg shadow-violet-600/30 transition-transform active:scale-95 text-sm whitespace-nowrap"
          >
            <Download className="w-5 h-5" />
            <span>Cetak Keduanya (1 File)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-blue-50 p-5 rounded-3xl shadow-sm border border-blue-100 flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">?</div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Cara Penggunaan:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside font-medium mb-3">
                <li>Pilih nama siswa di bawah ini.</li>
                <li>Pilih nilai (Muncul/Belum) di kanan.</li>
                <li>Klik tombol ungu "Generate AI".</li>
                <li>Klik "Tambah Foto" jika ada.</li>
                <li>Kembali ke atas, klik Cetak!</li>
              </ol>
              <button onClick={startTutorial} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center transition-colors">
                <PlayCircle className="w-5 h-5 mr-2" /> Mulai Tutorial Interaktif
              </button>
            </div>
          </div>

          <div id="step-pilih-siswa" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Pilih Data Siswa</h2>
            <select 
              className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:ring-0 focus:border-emerald-500 font-semibold text-slate-700 transition-colors"
              value={selectedSiswa}
              onChange={e => setSelectedSiswa(e.target.value)}
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map(s => <option key={s.id} value={s.id}>{s.nama_lengkap}</option>)}
            </select>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
            <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Data Fisik & Kehadiran</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Semester / TA</label>
                <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 transition-colors font-medium" value={semester} onChange={e => setSemester(e.target.value)} onBlur={() => savePengaturan("semester", semester)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Raport</label>
                <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 transition-colors font-medium" value={tanggalRaport} onChange={e => setTanggalRaport(e.target.value)} onBlur={() => savePengaturan("tanggal_raport", tanggalRaport)} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Cetak Identitas (Lembar Depan)</label>
                <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 transition-colors font-medium" value={tanggalIdentitas} onChange={e => setTanggalIdentitas(e.target.value)} onBlur={() => savePengaturan("tanggal_identitas", tanggalIdentitas)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tinggi (cm)</label>
                <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 transition-colors font-medium text-center" value={tinggi} onChange={e => setTinggi(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Berat (kg)</label>
                <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 transition-colors font-medium text-center" value={berat} onChange={e => setBerat(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Sakit</label>
                <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 transition-colors font-medium text-center" value={sakit} onChange={e => setSakit(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Izin</label>
                <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 transition-colors font-medium text-center" value={izin} onChange={e => setIzin(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Alpha</label>
                <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 transition-colors font-medium text-center" value={tanpaKeterangan} onChange={e => setTanpaKeterangan(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="col-span-1 lg:col-span-2">
          {renderSection("Nilai Agama, Moral & Budi Pekerti", "AGAMA", "agama", "agama")}
          {renderSection("Jati Diri", "JATI_DIRI", "jatiDiri", "jati_diri")}
          {renderSection("Dasar-dasar Literasi & STEAM", "LITERASI", "literasi", "literasi")}
          {renderSection("Projek / Kokurikuler", "PROJEK", "projek", "projek")}
        </div>
      </div>

      {activeCropCategory && (
        <ImageCropper 
          onCropComplete={(result) => {
            if (result) {
              setFotos(prev => {
                const newArr = [...prev[activeCropCategory]];
                if (Array.isArray(result)) {
                  newArr.push(...result);
                } else {
                  newArr.push(result);
                }
                // Batasi maksimal 9 foto
                return { ...prev, [activeCropCategory]: newArr.slice(0, 9) };
              });
            }
            setActiveCropCategory(null);
          }}  
          aspect={4/3} 
        />
      )}
    </div>
  );
}
