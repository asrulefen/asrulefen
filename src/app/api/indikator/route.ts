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

    // Gunakan user_id = 1 sebagai fallback (indikator bawaan/global) dan milik user itu sendiri
    const data = await db.execute({
      sql: "SELECT * FROM indikator WHERE user_id = ? OR user_id = '1' ORDER BY kategori ASC, urutan ASC",
      args: [userId.toString()]
    });
    return NextResponse.json(data.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch indikator' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const data = await req.json();
    
    const insert = await db.execute({
      sql: 'INSERT INTO indikator (kategori, deskripsi, urutan, user_id) VALUES (?, ?, ?, ?)',
      args: [data.kategori, data.deskripsi, data.urutan, userId]
    });
    return NextResponse.json({ id: insert.lastInsertRowid?.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create indikator' }, { status: 500 });
  }
}
