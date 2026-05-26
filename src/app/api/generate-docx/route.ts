import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free';
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const data = await req.json();
    const { siswaId, semester, tanggalRaport, tanggalIdentitas, tinggi, berat, sakit, izin, tanpaKeterangan, teks, fotos } = data;

    // Ambil data siswa
    const siswaRes = await db.execute({ sql: 'SELECT * FROM siswa WHERE id = ? AND user_id = ?', args: [siswaId, userId] });
    const siswa = siswaRes.rows[0] as any;
    if (!siswa) throw new Error("Siswa tidak ditemukan atau bukan milik Anda");

    // Ambil pengaturan global (Kop, Kepala TK, Guru Kelas)
    const settingsRows = (await db.execute('SELECT * FROM pengaturan')).rows as any[];
    const settings = settingsRows.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    // Helper untuk mengubah array string base64 menjadi array objek untuk looping docxtemplater
    const formatLoopPhotos = (photoArray: string[], textContent: string = "") => {
      if (!photoArray || photoArray.length === 0) return [];
      
      const textLength = textContent.length;
      let sizeCategory = "medium";
      
      // Heuristik: Semakin panjang teks atau semakin banyak foto, ukuran foto dikecilkan
      // agar tidak meluber ke halaman berikutnya.
      if (photoArray.length >= 5) {
          sizeCategory = "small";
      } else if (photoArray.length >= 3 && textLength > 350) {
          sizeCategory = "small";
      } else if (textLength > 600) {
          sizeCategory = "small";
      } else if (photoArray.length <= 2 && textLength < 250) {
          sizeCategory = "large";
      }

      return photoArray.map(base64 => ({
        foto_img: base64,
        sizeCategory: sizeCategory
      }));
    };

    // Persiapkan data untuk template
    const templateData = {
      // Data Identitas
      nama_lengkap: siswa.nama_lengkap,
      nama_panggilan: siswa.nama_panggilan,
      nisn: siswa.nisn,
      jenis_kelamin: siswa.jenis_kelamin,
      tempat_tanggal_lahir: `${siswa.tempat_lahir}, ${siswa.tanggal_lahir}`,
      agama: siswa.agama,
      anak_ke: siswa.anak_ke,
      nama_ayah: siswa.nama_ayah,
      nama_ibu: siswa.nama_ibu,
      pekerjaan_ayah: siswa.pekerjaan_ayah,
      pekerjaan_ibu: siswa.pekerjaan_ibu,
      alamat_jalan: siswa.alamat,
      desa: siswa.desa || "",
      kecamatan: siswa.kecamatan || "",
      kabupaten: siswa.kabupaten || "Tuban",
      provinsi: siswa.provinsi || "Jawa Timur",
      telepon: siswa.telepon,
      tanggal_identitas: tanggalIdentitas || "Tuban, 14 Juli 2025",
      
      // Data Raport
      nama_siswa: siswa.nama_lengkap,
      nipd: siswa.nipd || siswa.nisn,
      tinggi_badan: tinggi,
      berat_badan: berat,
      semester: semester.replace(/\s+/g, ''), // Hapus spasi agar muat 1 baris di font 14
      sakit: sakit,
      izin: izin,
      tanpa_keterangan: tanpaKeterangan,
      tanggal_raport: tanggalRaport || "Tuban, 20 Desember 2026",
      teks_agama: teks.agama,
      teks_jati_diri: teks.jatiDiri,
      teks_literasi: teks.literasi,
      teks_projek: teks.projek,
      
      // Data Looping Foto Dinamis (menggunakan teks untuk heuristik ukuran)
      loop_agama: formatLoopPhotos(fotos.agama, teks.agama),
      loop_jati_diri: formatLoopPhotos(fotos.jati_diri, teks.jatiDiri),
      loop_literasi: formatLoopPhotos(fotos.literasi, teks.literasi),
      loop_projek: formatLoopPhotos(fotos.projek, teks.projek),

      // Global Settings (Kop & Guru)
      nama_sekolah: settings.nama_sekolah || "TK PGRI NUR IKHLAS",
      kop_1: settings.kop_1 || "YAYASAN PEMBINA LEMBAGA PENDIDIKAN",
      kop_2: settings.kop_2 || "PERSATUAN GURU REPUBLIK INDONESIA JAWA TIMUR",
      kop_3: settings.kop_3 || "(YPLP PGRI JATIM) PERWAKILAN KABUPATEN TUBAN",
      kop_4: settings.kop_4 || "TAMAN KANAK-KANAK PGRI NUR IKHLAS",
      kop_5: settings.kop_5 || "DESA PRUNGGAHAN KULON KECAMATAN SEMANDING",
      kop_6: settings.kop_6 || "NPSN : 20574036 Email: tkpgrinuriklas@gmail.com",
      
      // Identitas Lembaga
      nama_tk_lembaga: settings.nama_tk_lembaga || "PGRI NUR IKHLAS",
      nss_npsn_lembaga: settings.nss_npsn_lembaga || "004050603035 / 20574036",
      alamat_tk_lembaga: settings.alamat_tk_lembaga || "DSN. MOJOKOPEK RT.01/RW.29",
      kode_pos_lembaga: settings.kode_pos_lembaga || "62381",
      desa_lembaga: settings.desa_lembaga || "PRUNGGAHAN KULON",
      kec_lembaga: settings.kec_lembaga || "SEMANDING",
      kab_lembaga: settings.kab_lembaga || "TUBAN",
      prov_lembaga: settings.prov_lembaga || "JAWA TIMUR",
      
      guru_kelas: settings.nama_guru_kelas || "TUNIK LUSTARI, S.Pd",
      npa_guru: settings.npa_guru_kelas || "13101200817",
      kepala_tk: settings.nama_kepala_tk || "INDAH ROHMAWATI, S.Pd",
      npa_kepala: settings.npa_kepala_tk || "13101200816",
    };

    // Fungsi untuk memproses base64 images
    const getOpts = () => ({
      centered: false,
      getImage(tagValue: string) {
        if (!tagValue || tagValue === 'undefined') return Buffer.from('');
        const base64Data = tagValue.replace(/^data:image\/\w+;base64,/, "");
        return Buffer.from(base64Data, "base64");
      },
      getSize(img: any, tagValue: string, tagName: string, context: any) {
        const sizeCategory = context?.scopeData?.sizeCategory;
        
        if (sizeCategory === "small") {
          return [140, 105]; // Kecil (jika teks panjang / foto banyak)
        } else if (sizeCategory === "large") {
          return [220, 165]; // Besar (jika teks pendek / foto sedikit)
        } else {
          return [180, 135]; // Sedang (Default)
        }
      },
    });

    // Proses Lembar Depan
    const contentDepan = fs.readFileSync(path.resolve(process.cwd(), 'public/template_depan_v2.docx'));
    const zipDepan = new PizZip(contentDepan);
    const docDepan = new Docxtemplater(zipDepan, {
      paragraphLoop: true,
      linebreaks: true,
    });
    docDepan.render(templateData);
    const bufDepan = docDepan.getZip().generate({ type: 'nodebuffer' });

    // Proses Raport
    const contentRaport = fs.readFileSync(path.resolve(process.cwd(), 'public/template_raport_v2.docx'));
    const zipRaport = new PizZip(contentRaport);
    const docRaport = new Docxtemplater(zipRaport, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [new ImageModule(getOpts())]
    });
    docRaport.render(templateData);
    const bufRaport = docRaport.getZip().generate({ type: 'nodebuffer' });

    // Proses Gabungan
    const contentGabungan = fs.readFileSync(path.resolve(process.cwd(), 'public/template_gabungan_v2.docx'));
    const zipGabungan = new PizZip(contentGabungan);
    const docGabungan = new Docxtemplater(zipGabungan, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [new ImageModule(getOpts())]
    });
    docGabungan.render(templateData);
    const bufGabungan = docGabungan.getZip().generate({ type: 'nodebuffer' });

    return NextResponse.json({
      depanBase64: bufDepan.toString('base64'),
      raportBase64: bufRaport.toString('base64'),
      gabunganBase64: bufGabungan.toString('base64'),
      filename: `Raport_${siswa.nama_lengkap}.docx`
    });
  } catch (error: any) {
    console.error("Docx Gen Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate docx' }, { status: 500 });
  }
}
