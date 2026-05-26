import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const data = await db.execute({ sql: 'SELECT * FROM siswa WHERE user_id = ? ORDER BY id DESC', args: [userId.toString()] });
    return NextResponse.json(data.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch siswa' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const body = await req.json();
    body.user_id = userId.toString();

    const insert = await db.execute({
      sql: `INSERT INTO siswa (
        nama_lengkap, nama_panggilan, nisn, kelompok, jenis_kelamin, 
        tempat_lahir, tanggal_lahir, agama, anak_ke, nama_ayah, nama_ibu, 
        pekerjaan_ayah, pekerjaan_ibu, alamat, telepon,
        desa, kecamatan, kabupaten, provinsi, nipd, user_id
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      args: [
        body.nama_lengkap, body.nama_panggilan, body.nisn, body.kelompok, body.jenis_kelamin,
        body.tempat_lahir, body.tanggal_lahir, body.agama, body.anak_ke, body.nama_ayah, body.nama_ibu,
        body.pekerjaan_ayah, body.pekerjaan_ibu, body.alamat, body.telepon,
        body.desa, body.kecamatan, body.kabupaten, body.provinsi, body.nipd, body.user_id
      ]
    });
    return NextResponse.json({ id: insert.lastInsertRowid?.toString() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create siswa' }, { status: 500 });
  }
}
