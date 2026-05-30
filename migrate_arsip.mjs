import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:raport.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Memulai migrasi tabel arsip_raport...");
  
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS arsip_raport (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      siswa_id INTEGER,
      nama_siswa TEXT,
      semester TEXT,
      jenis TEXT,
      file_name TEXT,
      data_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Migrasi tabel arsip_raport selesai!");
}

migrate().catch(console.error);
