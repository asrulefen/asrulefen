import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file || !type) {
      return NextResponse.json({ error: 'File atau tipe tidak ditemukan' }, { status: 400 });
    }

    if (type !== 'raport' && type !== 'depan' && type !== 'gabungan') {
      return NextResponse.json({ error: 'Tipe template tidak valid' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    try {
      // Membersihkan tag <w:proofErr> (Spell checker Word) yang sering merusak {tags} docxtemplater
      const zip = new PizZip(buffer);
      const files = zip.file(/.*\.xml$/);
      files.forEach((f: any) => {
        let xml = f.asText();
        
        // Hapus spell check
        xml = xml.replace(/<w:proofErr[^>]*\/>/g, '');
        
        // Memperbaiki tag {%foto_img} yang terpecah karena format MS Word
        // Regex ini akan menggabungkan kembali tag yang terbelah oleh <w:t> dan <w:r>
        xml = xml.replace(/\{%(?:<\/w:t>.*?<w:t[^>]*>)*foto_img(?:<\/w:t>.*?<w:t[^>]*>)*\}/g, '</w:t></w:r><w:r><w:t>{%foto_img}</w:t></w:r><w:r><w:t xml:space="preserve">');
        
        zip.file(f.name, xml);
      });
      buffer = zip.generate({ type: 'nodebuffer' }) as any;
    } catch (e) {
      console.warn("Gagal membersihkan spellcheck tags, menggunakan file asli.", e);
    }

    let filename = 'template_raport_v2.docx';
    if (type === 'depan') filename = 'template_depan_v2.docx';
    else if (type === 'gabungan') filename = 'template_gabungan_v2.docx';

    const filepath = path.join(process.cwd(), 'public', filename);

    // Write file directly to public directory
    fs.writeFileSync(filepath, buffer);

    return NextResponse.json({ success: true, message: `Template ${type} berhasil diperbarui` });
  } catch (error: any) {
    console.error("Upload Template Error:", error);
    return NextResponse.json({ error: error.message || 'Gagal mengupload template' }, { status: 500 });
  }
}
