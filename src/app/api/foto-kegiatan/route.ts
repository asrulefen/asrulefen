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
    const kategori = searchParams.get('kategori');
    const semester = searchParams.get('semester') || '1';

    if (kategori) {
      const data = await db.execute({
        sql: 'SELECT id, kategori, semester, foto_base64 FROM foto_kegiatan WHERE kategori = ? AND semester = ? AND user_id = ? ORDER BY created_at ASC',
        args: [kategori, semester, userId.toString()]
      });
      return NextResponse.json(data.rows);
    } else {
      // Return all photos grouped by category for current semester
      const data = await db.execute({
        sql: 'SELECT id, kategori, semester, foto_base64 FROM foto_kegiatan WHERE semester = ? AND user_id = ? ORDER BY kategori ASC, created_at ASC',
        args: [semester, userId.toString()]
      });
      return NextResponse.json(data.rows);
    }
  } catch (error: any) {
    console.error("Foto kegiatan GET error:", error);
    return NextResponse.json({ error: error.message || 'Failed to fetch foto' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const { kategori, semester, fotos } = await req.json();

    if (!kategori || !fotos || !Array.isArray(fotos)) {
      return NextResponse.json({ error: 'kategori dan fotos (array) wajib diisi' }, { status: 400 });
    }

    const insertedIds: number[] = [];

    for (const foto_base64 of fotos) {
      const result = await db.execute({
        sql: 'INSERT INTO foto_kegiatan (kategori, semester, foto_base64, user_id) VALUES (?, ?, ?, ?)',
        args: [kategori, semester || '1', foto_base64, userId.toString()]
      });
      if (result.lastInsertRowid) {
        insertedIds.push(Number(result.lastInsertRowid));
      }
    }

    return NextResponse.json({ success: true, insertedIds });
  } catch (error: any) {
    console.error("Foto kegiatan POST error:", error);
    return NextResponse.json({ error: error.message || 'Failed to save foto' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID foto wajib diisi' }, { status: 400 });
    }

    await db.execute({
      sql: 'DELETE FROM foto_kegiatan WHERE id = ? AND user_id = ?',
      args: [id, userId.toString()]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Foto kegiatan DELETE error:", error);
    return NextResponse.json({ error: error.message || 'Failed to delete foto' }, { status: 500 });
  }
}
