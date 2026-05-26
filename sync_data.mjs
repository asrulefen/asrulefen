import { createClient } from '@libsql/client';

async function sync() {
  const localDb = createClient({ url: 'file:raport.db' });
  const cloudDb = createClient({ 
    url: 'libsql://database-byzantium-book-vercel-icfg-ivpmouwuan2jhq2zyq0dqpt4.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Nzk3NjIxNjksImlkIjoiMDE5ZTYyMTctN2YwMS03ZjY4LWI0NTQtMGIxNzcwNjBmYzUyIiwicmlkIjoiMmYzZTQ5ODctZDA5ZS00ZmFhLTlhMTctMGU3NmIyNWUzNmNhIn0.Ob3S3tLymbN3ONEKni64xNakrYUSDTgGbj17ztC6qiFSUS3CZuoyXfCzMX2hd0hSaYt2lnv4ytCea_7rhyYKCw'
  });

  try {
    const siswa = await localDb.execute('SELECT * FROM siswa');
    console.log('Local Siswa count:', siswa.rows.length);

    // Delete existing cloud siswa just in case to avoid duplicates
    await cloudDb.execute("DELETE FROM siswa WHERE user_id = '1'");

    for (const s of siswa.rows) {
      await cloudDb.execute({
        sql: `INSERT INTO siswa (
          nama_lengkap, nama_panggilan, nisn, kelompok, jenis_kelamin, 
          tempat_lahir, tanggal_lahir, agama, anak_ke, nama_ayah, nama_ibu, 
          pekerjaan_ayah, pekerjaan_ibu, alamat, telepon,
          desa, kecamatan, kabupaten, provinsi, nipd, user_id
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1'
        )`,
        args: [
          s.nama_lengkap, s.nama_panggilan, s.nisn, s.kelompok, s.jenis_kelamin,
          s.tempat_lahir, s.tanggal_lahir, s.agama, s.anak_ke, s.nama_ayah, s.nama_ibu,
          s.pekerjaan_ayah, s.pekerjaan_ibu, s.alamat, s.telepon,
          s.desa, s.kecamatan, s.kabupaten, s.provinsi, s.nipd
        ]
      });
    }
    console.log('Siswa berhasil diupload!');

    const pengaturan = await localDb.execute('SELECT * FROM pengaturan');
    for (const p of pengaturan.rows) {
      await cloudDb.execute({
        sql: 'UPDATE pengaturan SET value = ? WHERE key = ?',
        args: [p.value, p.key]
      });
    }
    console.log('Pengaturan berhasil diupdate!');
  } catch(e) {
    console.error(e);
  }
}
sync();
