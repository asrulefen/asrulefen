import { createClient } from '@libsql/client';

const cloudDb = createClient({ 
  url: 'libsql://database-byzantium-book-vercel-icfg-ivpmouwuan2jhq2zyq0dqpt4.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Nzk3NjIxNjksImlkIjoiMDE5ZTYyMTctN2YwMS03ZjY4LWI0NTQtMGIxNzcwNjBmYzUyIiwicmlkIjoiMmYzZTQ5ODctZDA5ZS00ZmFhLTlhMTctMGU3NmIyNWUzNmNhIn0.Ob3S3tLymbN3ONEKni64xNakrYUSDTgGbj17ztC6qiFSUS3CZuoyXfCzMX2hd0hSaYt2lnv4ytCea_7rhyYKCw'
});

const students = [
  {
    nama_lengkap: 'BAGAS NARENDRA',
    nama_panggilan: 'BAGAS',
    nisn: '0636',
    kelompok: 'A',
    jenis_kelamin: 'Laki-laki',
    tempat_lahir: 'Tuban',
    tanggal_lahir: '-',
    agama: 'Islam',
    anak_ke: '-',
    nama_ayah: '-',
    nama_ibu: '-',
    pekerjaan_ayah: '-',
    pekerjaan_ibu: '-',
    alamat: '-',
    telepon: '-',
    nipd: '0636'
  },
  {
    nama_lengkap: 'NIKEN MARETA SARI',
    nama_panggilan: 'NIKEN',
    nisn: '0636',
    kelompok: 'A',
    jenis_kelamin: 'Perempuan',
    tempat_lahir: 'Tuban',
    tanggal_lahir: '-',
    agama: 'Islam',
    anak_ke: '-',
    nama_ayah: '-',
    nama_ibu: '-',
    pekerjaan_ayah: '-',
    pekerjaan_ibu: '-',
    alamat: '-',
    telepon: '-',
    nipd: '0636'
  },
  {
    nama_lengkap: 'M. ARKAAN RAFIF',
    nama_panggilan: 'ARKAAN',
    nisn: '0188821943',
    kelompok: 'A',
    jenis_kelamin: 'Laki-laki',
    tempat_lahir: 'Tuban',
    tanggal_lahir: '15 Mei 2018',
    agama: 'Islam',
    anak_ke: '1 (Satu)',
    nama_ayah: 'BAHRUDIN',
    nama_ibu: 'NURUL HIDAYAH',
    pekerjaan_ayah: 'Wiraswasta',
    pekerjaan_ibu: 'Mengurus Rumah Tangga',
    alamat: 'Ds. Rengel Rt 02 Rw 01 Kec. Rengel Kab. Tuban',
    telepon: '-',
    nipd: '0188821943'
  }
];

async function run() {
  for (const s of students) {
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
        '', '', '', '', s.nipd
      ]
    });
  }
  console.log('Done uploading missing students!');
}
run();
