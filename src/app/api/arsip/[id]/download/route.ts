import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userRes = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [session.user.email] });
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = userRes.rows[0].id;

    const params = await context.params;
    
    const res = await db.execute({
      sql: 'SELECT data_json FROM arsip_raport WHERE id = ? AND user_id = ?',
      args: [params.id, userId.toString()]
    });
    
    if (res.rows.length === 0) return NextResponse.json({ error: 'Arsip tidak ditemukan' }, { status: 404 });
    
    return NextResponse.json(JSON.parse(res.rows[0].data_json as string));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch arsip data' }, { status: 500 });
  }
}
