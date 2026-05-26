const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('C:\\Users\\evn\\Videos\\aplikasi raport tk pgri\\isi raport\\1. BILKIS ANAJWA.docx');
const zip = new PizZip(content);
let xml = zip.file('word/document.xml').asText();

const replacements = {
    "101": "{tinggi_badan}",
    "14,20": "{berat_badan}",
    "Alhamdulillah di semester ini ananda BILKIS": "{teks_agama}"
};

for (const [search, replace] of Object.entries(replacements)) {
    if (xml.includes(search)) {
        console.log(`Found exact match for: ${search.substring(0, 30)}...`);
    } else {
        console.log(`NOT FOUND: ${search.substring(0, 30)}...`);
    }
}
