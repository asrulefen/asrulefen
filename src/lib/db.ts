import { createClient } from "@libsql/client";

// Gunakan global agar tidak ter-reconnect berkali-kali saat fast refresh di Next.js dev mode
declare global {
  var _db: any;
}

export const db = global._db || createClient({
  url: process.env.TURSO_DATABASE_URL || "file:raport.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

if (process.env.NODE_ENV !== 'production') {
  global._db = db;
}

export default db;
