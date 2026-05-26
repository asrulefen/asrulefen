import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const data = await db.execute('SELECT * FROM pengaturan');
    const settings = data.rows.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pengaturan' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const settings = await req.json();
    const statements = [];
    
    for (const [key, value] of Object.entries(settings)) {
      statements.push({
        sql: 'INSERT OR REPLACE INTO pengaturan (key, value) VALUES (?, ?)',
        args: [key, value]
      });
    }
    
    if (statements.length > 0) {
      await db.batch(statements, "write");
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update pengaturan' }, { status: 500 });
  }
}
