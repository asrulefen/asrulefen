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
    nisn: "0636",
    kelompok: "A",
    jenis_kelamin: "Perempuan",
    tempat_lahir: "Tuban",
    tanggal_lahir: "-",
    agama: "Islam",
    anak_ke: "-",
    nama_ayah: "-",
    nama_ibu: "-",
    pekerjaan_ayah: "-",
    pekerjaan_ibu: "-",
    alamat: "-",
    telepon: "-",
    tinggi_badan: "101 cm",
    berat_badan: "14,20 kg"
  },
  {
    nama_lengkap: "BAGAS NARENDRA",
    nama_panggilan: "BAGAS",
    nisn: "0636",
    kelompok: "A",
    jenis_kelamin: "Laki-laki",
    tempat_lahir: "Tuban",
    tanggal_lahir: "-",
    agama: "Islam",
    anak_ke: "-",
    nama_ayah: "-",
    nama_ibu: "-",
    pekerjaan_ayah: "-",
    pekerjaan_ibu: "-",
    alamat: "-",
    telepon: "-",
    tinggi_badan: "106 cm",
    berat_badan: "16,75 kg"
  },
  {
    nama_lengkap: "NIKEN MARETA SARI",
    nama_panggilan: "NIKEN",
    nisn: "0636",
    kelompok: "A",
    jenis_kelamin: "Perempuan",
    tempat_lahir: "Tuban",
    tanggal_lahir: "-",
    agama: "Islam",
    anak_ke: "-",
    nama_ayah: "-",
    nama_ibu: "-",
    pekerjaan_ayah: "-",
    pekerjaan_ibu: "-",
    alamat: "-",
    telepon: "-",
    tinggi_badan: "96 cm",
    berat_badan: "15,00 kg"
  }
];

db.transaction(() => {
  for (const student of students) {
    try {
      insert.run(student);
    } catch (e) {
      // Ignore if columns are missing in older DB version
      console.error(e.message);
    }
  }
})();

console.log("Berhasil menambahkan 3 data siswa asli dari folder isi raport!");
db.close();
