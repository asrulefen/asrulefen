const fs = require('fs');
const { execSync } = require('child_process');

console.log("Mulai memproses file untuk deployment...");

try {
  // Copy public folder
  console.log("Menyalin folder public...");
  fs.cpSync('public', '.next/standalone/public', { recursive: true, force: true });
  
  // Copy static folder
  console.log("Menyalin folder static...");
  fs.cpSync('.next/static', '.next/standalone/.next/static', { recursive: true, force: true });
  
  // Copy DB and ENV
  console.log("Menyalin file database dan konfigurasi...");
  if (fs.existsSync('raport.db')) {
    fs.copyFileSync('raport.db', '.next/standalone/raport.db');
  }
  if (fs.existsSync('.env.local')) {
    fs.copyFileSync('.env.local', '.next/standalone/.env.local');
  }

  console.log("Membuat file ZIP (ini mungkin memakan waktu beberapa detik)...");
  // Execute powershell compression
  execSync('powershell.exe -NoProfile -Command "Compress-Archive -Path .\\.next\\standalone\\* -DestinationPath .\\upload_raport.zip -Force"');
  
  console.log("✅ Berhasil! File upload_raport.zip sudah siap di-upload ke cPanel.");
} catch (e) {
  console.error("❌ Terjadi kesalahan:", e);
}
