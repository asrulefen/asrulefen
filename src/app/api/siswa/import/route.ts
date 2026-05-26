import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const siswaList = await req.json();
    
    if (!Array.isArray(siswaList) || siswaList.length === 0) {
      return NextResponse.json({ error: 'Data tidak valid atau kosong' }, { status: 400 });
    }

    const statements = [];
    let imported = 0;

    for (const data of siswaList) {
      if (!data.nama_lengkap) continue;
      
      statements.push({
        sql: `
          INSERT INTO siswa (
            nama_lengkap, nama_panggilan, nisn, nipd, kelompok, jenis_kelamin, tempat_lahir,
            tanggal_lahir, agama, anak_ke, nama_ayah, nama_ibu, pekerjaan_ayah, pekerjaan_ibu,
            alamat, desa, kecamatan, kabupaten, provinsi, telepon, user_id
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
        `,
        args: [
          data.nama_lengkap || "",
          data.nama_panggilan || "",
          data.nisn || "",
          data.nipd || data.NIPD || "",
          data.kelompok || "A",
          data.jenis_kelamin || "Laki-laki",
          data.tempat_lahir || "",
          data.tanggal_lahir || "",
          data.agama || "Islam",
          data.anak_ke || "1",
          data.nama_ayah || "",
          data.nama_ibu || "",
          data.pekerjaan_ayah || "",
          data.pekerjaan_ibu || "",
          data.alamat || "",
          data.desa || "",
          data.kecamatan || "",
          data.kabupaten || "",
          data.provinsi || "",
          data.telepon || "",
          userId
        ]
      });
      imported++;
    }

    if (statements.length > 0) {
      await db.batch(statements, "write");
    }

    return NextResponse.json({ success: true, count: imported });
  } catch (error: any) {
    console.error("Bulk Import Error:", error);
    return NextResponse.json({ error: 'Gagal mengimpor data siswa' }, { status: 500 });
  }
}
