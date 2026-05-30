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

    // Ambil data arsip tanpa data_json agar enteng
    const data = await db.execute({
      sql: 'SELECT id, siswa_id, nama_siswa, semester, jenis, file_name, created_at FROM arsip_raport WHERE user_id = ? ORDER BY id DESC',
      args: [userId.toString()]
    });
    
    return NextResponse.json(data.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch arsip' }, { status: 500 });
  }
}
