import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const { searchParams } = new URL(req.url);
    const semester = searchParams.get('semester') || '1';
    const siswaId = searchParams.get('siswa_id');

    if (siswaId) {
      // Get single student data
      const data = await db.execute({
        sql: 'SELECT * FROM data_fisik WHERE siswa_id = ? AND semester = ? AND user_id = ?',
        args: [siswaId, semester, userId.toString()]
      });
      return NextResponse.json(data.rows[0] || null);
    } else {
      // Get all students data for this semester
      const data = await db.execute({
        sql: 'SELECT * FROM data_fisik WHERE semester = ? AND user_id = ?',
        args: [semester, userId.toString()]
      });
      return NextResponse.json(data.rows);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    
    // Support bulk save (array) or single save
    const items = Array.isArray(body) ? body : [body];
    
    const statements = items.map(item => ({
      sql: `INSERT INTO data_fisik (siswa_id, semester, tinggi, berat, sakit, izin, tanpa_keterangan, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(siswa_id, semester, user_id) 
            DO UPDATE SET tinggi=excluded.tinggi, berat=excluded.berat, sakit=excluded.sakit, izin=excluded.izin, tanpa_keterangan=excluded.tanpa_keterangan`,
      args: [
        item.siswa_id,
        item.semester || '1',
        item.tinggi || '',
        item.berat || '',
        item.sakit || '0',
        item.izin || '0',
        item.tanpa_keterangan || '0',
        userId.toString()
      ]
    }));

    await db.batch(statements, "write");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
