"use client";
import { useState, useEffect } from "react";
import { Download, Trash2, Loader2, Archive } from "lucide-react";

type Arsip = {
  id: number;
  siswa_id: number;
  nama_siswa: string;
  semester: string;
  jenis: string;
  file_name: string;
  created_at: string;
};

export default function ArsipPage() {
  const [arsipList, setArsipList] = useState<Arsip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchArsip = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/arsip");
      if (res.ok) {
        setArsipList(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArsip();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus arsip ini?")) {
      await fetch(`/api/arsip/${id}`, { method: "DELETE" });
      fetchArsip();
    }
  };

  const handleDownload = async (id: number, filename: string) => {
    setDownloadingId(id);
    try {
      // 1. Fetch JSON data from arsip
      const resData = await fetch(`/api/arsip/${id}/download`);
      if (!resData.ok) throw new Error("Gagal mengambil data arsip");
      const jsonData = await resData.json();

      // 2. Pass JSON data to generate-docx
      const resDocx = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
      });
      
      const data = await resDocx.json();
      if (resDocx.ok) {
        // Download gabungan by default for arsip, or you could offer choices
        const base64Data = data.gabunganBase64;
        
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
    } catch (e: any) {
      alert(e.message || "Gagal mengunduh raport dari arsip");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Archive className="w-6 h-6 text-emerald-600" />
            Arsip Raport
          </h1>
          <p className="text-slate-500 mt-1">
            Riwayat raport yang sudah dicetak. Otomatis terhapus setelah 6 bulan.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : arsipList.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Belum ada arsip raport. Cetak raport di menu Input Raport untuk menyimpannya ke arsip.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-700">Nama Siswa</th>
                  <th className="p-4 font-semibold text-slate-700">Semester</th>
                  <th className="p-4 font-semibold text-slate-700">Tanggal Dibuat</th>
                  <th className="p-4 font-semibold text-slate-700 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {arsipList.map((arsip) => (
                  <tr key={arsip.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{arsip.nama_siswa}</td>
                    <td className="p-4 text-slate-600">{arsip.semester}</td>
                    <td className="p-4 text-slate-600">
                      {new Date(arsip.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4 flex justify-center space-x-2">
                      <button
                        onClick={() => handleDownload(arsip.id, arsip.file_name)}
                        disabled={downloadingId === arsip.id}
                        className="bg-sky-100 text-sky-700 hover:bg-sky-200 px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition-colors disabled:opacity-50"
                      >
                        {downloadingId === arsip.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleDelete(arsip.id)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
