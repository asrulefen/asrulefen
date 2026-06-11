import db from "./db";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_API_KEY = process.env.OPENROUTER_API_KEY || "";
const MODELS_TO_TRY = [
  "google/gemini-2.0-flash-001",
  "google/gemini-2.5-flash",
  "meta-llama/llama-3.1-8b-instruct",
  "mistralai/mistral-7b-instruct",
];

export async function generateNarasi(kategori: string, namaSiswa: string, indikatorData: {deskripsi: string, nilai: string}[]) {
  try {
    let apiKey = DEFAULT_API_KEY;
    let primaryModel = MODELS_TO_TRY[0];

    try {
      const data = await db.execute("SELECT key, value FROM pengaturan WHERE key IN ('openrouter_api_key', 'ai_model')");
      const settings = data.rows.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      
      if (settings.openrouter_api_key && settings.openrouter_api_key.trim() !== "") {
        apiKey = settings.openrouter_api_key;
      }
      if (settings.ai_model && settings.ai_model.trim() !== "") {
        primaryModel = settings.ai_model;
      }
    } catch (dbError) {
      console.error("Gagal mengambil pengaturan API dari database", dbError);
    }

    const indikatorText = indikatorData.map(i => `- ${i.deskripsi}: ${i.nilai}`).join("\n");

    // Format nama menjadi Title Case (Huruf depan besar, sisanya kecil)
    const titleCaseName = namaSiswa.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const firstName = titleCaseName.split(' ')[0]; // Ambil kata pertama untuk panggilan

    const systemPrompt = `Anda adalah seorang guru TK yang sedang menulis paragraf naratif untuk buku raport (laporan perkembangan anak).`;

    const userPrompt = `Tuliskan 1 paragraf narasi untuk kategori: ${kategori}.
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

    // Build model list with primary model first
    const modelsToTry = [primaryModel, ...MODELS_TO_TRY.filter(m => m !== primaryModel)];

    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.4,
            max_tokens: 2048,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
          console.log(`[AI] Berhasil generate narasi dengan model: ${modelName}`);
          return data.choices[0].message.content;
        } else {
          throw new Error("Format balasan OpenRouter tidak sesuai");
        }
      } catch (modelError: any) {
        console.warn(`[AI] Model ${modelName} gagal:`, modelError.message);
        lastError = modelError;
      }
    }

    throw new Error(lastError?.message || "Semua model AI gagal dicoba.");
  } catch (error: any) {
    console.error("OpenRouter API Error:", error);
    throw new Error(error.message || "Gagal menghasilkan narasi dari AI.");
  }
}
