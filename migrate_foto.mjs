import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:raport.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Membuat tabel foto_kegiatan dan data_fisik...");

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS foto_kegiatan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kategori TEXT NOT NULL,
      semester TEXT DEFAULT '1',
      foto_base64 TEXT NOT NULL,
      user_id TEXT DEFAULT '1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS data_fisik (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      siswa_id INTEGER NOT NULL,
      semester TEXT NOT NULL DEFAULT '1',
      tinggi TEXT DEFAULT '',
      berat TEXT DEFAULT '',
      sakit TEXT DEFAULT '0',
      izin TEXT DEFAULT '0',
      tanpa_keterangan TEXT DEFAULT '0',
      user_id TEXT DEFAULT '1',
      UNIQUE(siswa_id, semester, user_id)
    );
  `);

  console.log("✅ Tabel berhasil dibuat!");
}

migrate().catch(console.error);

