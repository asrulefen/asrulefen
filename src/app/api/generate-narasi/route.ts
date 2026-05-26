import { NextResponse } from 'next/server';
import { generateNarasi } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { kategori, namaSiswa, indikatorData } = await req.json();
    const text = await generateNarasi(kategori, namaSiswa, indikatorData);
    return NextResponse.json({ text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate narasi' }, { status: 500 });
  }
}
