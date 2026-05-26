const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('C:\\Users\\evn\\Videos\\aplikasi raport tk pgri\\isi raport\\1. BILKIS ANAJWA.docx');
const zip = new PizZip(content);
const xml = zip.file('word/document.xml').asText();

fs.writeFileSync('original_document.xml', xml);
console.log('Original XML saved to original_document.xml');
