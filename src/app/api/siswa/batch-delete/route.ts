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

    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    const statements = ids.map((id: number) => ({
      sql: 'DELETE FROM siswa WHERE id = ? AND user_id = ?',
      args: [id, userId.toString()]
    }));

    await db.batch(statements, "write");

    return NextResponse.json({ success: true, deletedCount: ids.length });
  } catch (error) {
    console.error("Batch delete error:", error);
    return NextResponse.json({ error: 'Failed to delete siswa' }, { status: 500 });
  }
}
