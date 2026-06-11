import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:raport.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Membuat tabel foto_kegiatan...");

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS foto_kegiatan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kategori TEXT NOT NULL,
      semester TEXT DEFAULT '1',
      foto_base64 TEXT NOT NULL,
      user_id TEXT DEFAULT '1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Tabel foto_kegiatan berhasil dibuat!");
}

migrate().catch(console.error);
