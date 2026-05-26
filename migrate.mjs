import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:raport.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Memulai migrasi database...");
  
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS siswa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_lengkap TEXT NOT NULL,
      nama_panggilan TEXT,
      nisn TEXT,
      kelompok TEXT DEFAULT 'A',
      jenis_kelamin TEXT,
      tempat_lahir TEXT,
      tanggal_lahir TEXT,
      agama TEXT,
      anak_ke TEXT,
      nama_ayah TEXT,
      nama_ibu TEXT,
      pekerjaan_ayah TEXT,
      pekerjaan_ibu TEXT,
      alamat TEXT,
      telepon TEXT,
      desa TEXT DEFAULT '',
      kecamatan TEXT DEFAULT '',
      kabupaten TEXT DEFAULT 'Tuban',
      provinsi TEXT DEFAULT 'Jawa Timur',
      nipd TEXT DEFAULT '',
      user_id TEXT DEFAULT '1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pengaturan (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS indikator (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kategori TEXT NOT NULL,
      deskripsi TEXT NOT NULL,
      urutan INTEGER DEFAULT 0,
      user_id TEXT DEFAULT '1'
    );

    CREATE TABLE IF NOT EXISTS raport (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      siswa_id INTEGER,
      semester TEXT NOT NULL,
      tinggi_badan TEXT,
      berat_badan TEXT,
      sakit TEXT DEFAULT '0',
      izin TEXT DEFAULT '0',
      tanpa_keterangan TEXT DEFAULT '0',
      
      teks_agama TEXT,
      teks_jati_diri TEXT,
      teks_literasi TEXT,
      teks_projek TEXT,
      refleksi_guru TEXT,

      foto_agama_1 TEXT, foto_agama_2 TEXT, foto_agama_3 TEXT,
      foto_jati_diri_1 TEXT, foto_jati_diri_2 TEXT, foto_jati_diri_3 TEXT,
      foto_literasi_1 TEXT, foto_literasi_2 TEXT, foto_literasi_3 TEXT,
      foto_projek_1 TEXT, foto_projek_2 TEXT, foto_projek_3 TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(siswa_id) REFERENCES siswa(id)
    );

    CREATE TABLE IF NOT EXISTS nilai_indikator (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      raport_id INTEGER,
      indikator_id INTEGER,
      nilai TEXT,
      FOREIGN KEY(raport_id) REFERENCES raport(id) ON DELETE CASCADE,
      FOREIGN KEY(indikator_id) REFERENCES indikator(id)
    );
  `);

  console.log("Tabel berhasil dibuat.");

  // Insert default data
  const countIndikator = await db.execute('SELECT COUNT(*) as count FROM indikator');
  if (countIndikator.rows[0].count === 0) {
    console.log("Memasukkan indikator default...");
    const defaultIndikator = [
      ['AGAMA', 'Mengucap kalimat Thoyyibah', 1],
      ['AGAMA', 'Melaksanakan atau mempraktekkan ibadah sehari-hari (Praktek sholat dhuha)', 2],
      ['AGAMA', 'Berdoa sebelum dan sesudah melaksanakan kegiatan dengan tertib', 3],
      ['AGAMA', 'Mengembalikan benda yang tidak miliknya', 4],
      ['AGAMA', 'Mengucap permisi jika mau lewat', 5],
      ['JATI_DIRI', 'Melakukan permainan fisik dengan teratur', 1],
      ['JATI_DIRI', 'Menggunakan alat tulis atau memegang pensil dengan benar', 2],
      ['JATI_DIRI', 'Meniru gerakan senam fantasi', 3],
      ['JATI_DIRI', 'Berdiri dengan tumit, berdiri dengan satu kaki dengan seimbang', 4],
      ['JATI_DIRI', 'Sabar menunggu giliran', 5],
      ['JATI_DIRI', 'Mau ditinggal ibu tanpa menangis', 6],
      ['LITERASI', 'Melakukan 2-3 perintah sederhana', 1],
      ['LITERASI', 'Menyebut Kembali 3-4 kata yang baru didengarnya', 2],
      ['LITERASI', 'Menyebut dan menunjukkan benda-benda yang berbentuk geometri', 3],
      ['LITERASI', 'Menunjukkan urutan benda untuk bilangan 1-10', 4],
      ['LITERASI', 'Melukis dengan jari', 5],
      ['LITERASI', 'Menyebutkan benda di sekitar sesuai dengan fungsinya', 6],
      ['PROJEK', 'Mengenal lingkungan serta memupuk kepedulian terhadap alam', 1],
      ['PROJEK', 'Melakukan kegiatan praktik secara bergotong royong', 2],
      ['PROJEK', 'Menyiapkan bahan-bahan menanam biji jagung dengan sistem hidroponik', 3],
      ['PROJEK', 'Menunjukkan antusiasme yang luar biasa dan mengisi media tanam dengan rapi', 4],
      ['PROJEK', 'Tekun memasukkan benih dan bertanggung jawab menyiram tanaman', 5],
      ['PROJEK', 'Menceritakan perubahan jagung dari tunas hingga tumbuh daun', 6],
    ];

    for (const item of defaultIndikator) {
      await db.execute({
        sql: "INSERT INTO indikator (kategori, deskripsi, urutan, user_id) VALUES (?, ?, ?, '1')",
        args: item
      });
    }
  }

  const apiKeySetting = await db.execute("SELECT value FROM pengaturan WHERE key = 'gemini_api_key'");
  if (apiKeySetting.rows.length === 0) {
    console.log("Memasukkan pengaturan default...");
    await db.execute("INSERT INTO pengaturan (key, value) VALUES ('gemini_api_key', 'AIzaSyBdyaDHSyeiVtW0DC69TOPwDK58IF8HomU')");
  }

  console.log("✅ Migrasi selesai!");
}

migrate().catch(console.error);
