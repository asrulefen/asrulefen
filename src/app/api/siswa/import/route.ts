import { NextResponse } from 'next/server';
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
          data.nama_lengkap?.toString() || "",
          data.nama_panggilan?.toString() || "",
          data.nisn?.toString() || "",
          (data.nipd || data.NIPD)?.toString() || "",
          data.kelompok?.toString() || "A",
          data.jenis_kelamin?.toString() || "Laki-laki",
          data.tempat_lahir?.toString() || "",
          data.tanggal_lahir?.toString() || "",
          data.agama?.toString() || "Islam",
          data.anak_ke?.toString() || "1",
          data.nama_ayah?.toString() || "",
          data.nama_ibu?.toString() || "",
          data.pekerjaan_ayah?.toString() || "",
          data.pekerjaan_ibu?.toString() || "",
          data.alamat?.toString() || "",
          data.desa?.toString() || "",
          data.kecamatan?.toString() || "",
          data.kabupaten?.toString() || "",
          data.provinsi?.toString() || "",
          data.telepon?.toString() || "",
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
