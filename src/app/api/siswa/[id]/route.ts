import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const params = await context.params;
    const data = await req.json();
    
    await db.execute({
      sql: `
      UPDATE siswa SET
        nama_lengkap = ?, nama_panggilan = ?, nisn = ?, nipd = ?,
        kelompok = ?, jenis_kelamin = ?, tempat_lahir = ?,
        tanggal_lahir = ?, agama = ?, anak_ke = ?,
        nama_ayah = ?, nama_ibu = ?, pekerjaan_ayah = ?,
        pekerjaan_ibu = ?, alamat = ?, desa = ?, 
        kecamatan = ?, kabupaten = ?, provinsi = ?, telepon = ?
      WHERE id = ? AND user_id = ?
    `, args: [
        data.nama_lengkap, data.nama_panggilan, data.nisn, data.nipd,
        data.kelompok, data.jenis_kelamin, data.tempat_lahir,
        data.tanggal_lahir, data.agama, data.anak_ke,
        data.nama_ayah, data.nama_ibu, data.pekerjaan_ayah,
        data.pekerjaan_ibu, data.alamat, data.desa,
        data.kecamatan, data.kabupaten, data.provinsi, data.telepon,
        params.id, userId
      ]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update siswa' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const params = await context.params;
    await db.execute({ sql: 'DELETE FROM siswa WHERE id = ? AND user_id = ?', args: [params.id, userId] });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete siswa' }, { status: 500 });
  }
}
