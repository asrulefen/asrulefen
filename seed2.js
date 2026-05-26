const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'raport.db');
const db = new Database(dbPath);

const insert = db.prepare(`
  INSERT INTO siswa (
    nama_lengkap, nama_panggilan, nisn, kelompok, jenis_kelamin, tempat_lahir,
    tanggal_lahir, agama, anak_ke, nama_ayah, nama_ibu, pekerjaan_ayah, pekerjaan_ibu,
    alamat, telepon
  ) VALUES (
    @nama_lengkap, @nama_panggilan, @nisn, @kelompok, @jenis_kelamin, @tempat_lahir,
    @tanggal_lahir, @agama, @anak_ke, @nama_ayah, @nama_ibu, @pekerjaan_ayah, @pekerjaan_ibu,
    @alamat, @telepon
  )
`);

const students = [
  {
    nama_lengkap: "BILKIS ANAJWA",
    nama_panggilan: "BILKIS",
    nisn: "0177721832",
    kelompok: "B",
    jenis_kelamin: "Perempuan",
    tempat_lahir: "Tuban",
    tanggal_lahir: "19 April 2017",
    agama: "Islam",
    anak_ke: "2 (Dua)",
    nama_ayah: "ANDIK SETYAWAN",
    nama_ibu: "SITI ROKAYAH",
    pekerjaan_ayah: "Swasta",
    pekerjaan_ibu: "Mengurus Rumah Tangga",
    alamat: "Ds. Kebonagung Rt 07 Rw 03 Kec. Rengel Kab. Tuban",
    telepon: "-"
  },
  {
    nama_lengkap: "M. ARKAAN RAFIF",
    nama_panggilan: "ARKAAN",
    nisn: "0188821943",
    kelompok: "A",
    jenis_kelamin: "Laki-laki",
    tempat_lahir: "Tuban",
    tanggal_lahir: "15 Mei 2018",
    agama: "Islam",
    anak_ke: "1 (Satu)",
    nama_ayah: "BAHRUDIN",
    nama_ibu: "NURUL HIDAYAH",
    pekerjaan_ayah: "Wiraswasta",
    pekerjaan_ibu: "Mengurus Rumah Tangga",
    alamat: "Ds. Rengel Rt 02 Rw 01 Kec. Rengel Kab. Tuban",
    telepon: "-"
  }
];

db.transaction(() => {
  for (const student of students) {
    insert.run(student);
  }
})();

console.log("Berhasil menambahkan 2 data siswa asli dari template!");
db.close();
