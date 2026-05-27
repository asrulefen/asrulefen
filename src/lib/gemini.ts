import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "./db";

export async function generateNarasi(kategori: string, namaSiswa: string, indikatorData: {deskripsi: string, nilai: string}[]) {
  try {
    let apiKey = process.env.GEMINI_API_KEY || "";
    let modelName = "gemini-1.5-flash"; // default fallback

    try {
      const data = await db.execute("SELECT key, value FROM pengaturan WHERE key IN ('gemini_api_key', 'gemini_model')");
      const settings = data.rows.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      
      if (settings.gemini_api_key && settings.gemini_api_key.trim() !== "") {
        apiKey = settings.gemini_api_key;
      }
      if (settings.gemini_model && settings.gemini_model.trim() !== "") {
        modelName = settings.gemini_model;
      }
    } catch (dbError) {
      console.error("Gagal mengambil pengaturan API dari database", dbError);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const indikatorText = indikatorData.map(i => `- ${i.deskripsi}: ${i.nilai}`).join("\n");

    // Format nama menjadi Title Case (Huruf depan besar, sisanya kecil)
    const titleCaseName = namaSiswa.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const firstName = titleCaseName.split(' ')[0]; // Ambil kata pertama untuk panggilan

    const prompt = `Anda adalah seorang guru TK yang sedang menulis paragraf naratif untuk buku raport (laporan perkembangan anak).
Tuliskan 1 paragraf narasi untuk kategori: ${kategori}.
Nama anak: ${titleCaseName}.

Berikut adalah data indikator dan tingkat pencapaiannya:
${indikatorText}

Instruksi gaya penulisan:
1. Mulailah kalimat pertama dengan "Alhamdulillah di semester ini ananda ${firstName}..." (jika kategori selain projek), atau sesuaikan jika ini untuk kategori Projek/Kokurikuler.
2. PENTING: Sebutkan nama anak (${firstName}) HANYA SATU KALI di kalimat pertama. Untuk kalimat-kalimat selanjutnya, SELALU gunakan kata ganti "Ananda" (dengan huruf A besar). JANGAN PERNAH menggunakan kata ganti "Ia" atau "Dia". Jangan pernah menulis nama anak dengan huruf kapital semua (gunakan "${firstName}", bukan huruf besar semua).
3. Gunakan kalimat yang positif, mengalir, lembut khas guru TK, dan profesional.
4. SANGAT PENTING: Anda WAJIB menyertakan sebutan nilai/tolok ukur dari setiap indikator persis seperti data yang diberikan (contoh: "sudah muncul", "muncul Sebagian besar", "belum muncul") di akhir/samping deskripsi indikator tersebut secara eksplisit. 
   Contoh format: "Alhamdulillah di semester ini ananda [Nama] [deskripsi indikator 1] [nilai], [deskripsi indikator 2] [nilai], dan [deskripsi indikator 3] [nilai]."
5. JANGAN PERNAH menaruh nilai/tolok ukur di dalam tanda kurung "( )". Nilai harus menyatu dan mengalir dengan kalimat.
   Salah: "bergotong royong (Sudah Muncul)"
   Benar: "bergotong royong sudah muncul"
6. Jangan merangkum nilai menjadi kalimat atau kata sifat lain. Gunakan frasa nilai aslinya berulang kali tidak apa-apa sesuai dengan indikator yang dibahas di paragraf itu.
7. Jangan menulis dalam bentuk poin-poin (bullet points). Semuanya harus berupa 1 paragraf utuh yang rapi.
8. MUTLAK: Panjang paragraf HARUS 4 sampai 6 kalimat, TIDAK BOLEH LEBIH. Jika indikatornya banyak, gabungkan beberapa indikator ke dalam satu kalimat majemuk panjang agar batas 6 kalimat tidak terlewati.
9. (Khusus kategori Projek): Sebutkan bahwa ananda berpartisipasi dalam projek, dan ceritakan pencapaiannya dengan menyertakan nilai tiap indikator seperti instruksi nomor 4.

Tuliskan narasinya saja tanpa tambahan salam atau penutup.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Gagal menghasilkan narasi dari AI.");
  }
}
