const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module-free');

const filepath = 'public/template_raport_v2.docx';
const content = fs.readFileSync(filepath);
const zip = new PizZip(content);
const files = zip.file(/.*\.xml$/);
files.forEach((f) => {
  let xml = f.asText();
  xml = xml.replace(/<w:proofErr[^>]*\/>/g, '');
  xml = xml.replace(/\{%(?:<\/w:t>.*?<w:t[^>]*>)*foto_img(?:<\/w:t>.*?<w:t[^>]*>)*\}/g, '</w:t></w:r><w:r><w:t>{%foto_img}</w:t></w:r><w:r><w:t xml:space="preserve">');
  zip.file(f.name, xml);
});
const newBuffer = zip.generate({ type: 'nodebuffer' });
fs.writeFileSync('test_cleaned.docx', newBuffer);

try {
  const testZip = new PizZip(newBuffer);
  const imageModule = new ImageModule({
    centered: false,
    getImage(tagValue) { return Buffer.from(''); },
    getSize() { return [100, 100]; }
  });
  const doc = new Docxtemplater(testZip, { paragraphLoop: true, linebreaks: true, modules: [imageModule] });
  doc.render({
    nama_siswa: 'Test', loop_agama: [{ foto_img: '1' }], loop_jati_diri: [], loop_literasi: [], loop_projek: []
  });
  console.log('Docxtemplater rendered successfully!');
} catch (e) {
  if (e.properties && e.properties.errors) {
    e.properties.errors.forEach(err => console.log(err.message, err.properties.id));
  } else {
    console.log('STILL FAILED:', e);
  }
}
