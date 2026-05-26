const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

function replaceSplitText(xml, searchStr, replaceStr) {
    let pattern = "";
    for (let i = 0; i < searchStr.length; i++) {
        let char = searchStr[i];
        if ("()[]{}.*+?^$|\\".includes(char)) {
            char = "\\" + char;
        }
        pattern += char;
        if (i < searchStr.length - 1) {
            pattern += "(?:<[^>]+>)*";
        }
    }
    const regex = new RegExp(pattern, 'g');
    return xml.replace(regex, replaceStr);
}

function createTemplate(sourcePath, destPath, replacements) {
    console.log(`Creating template ${destPath} from ${sourcePath}`);
    // DO NOT use 'binary' encoding string, it corrupts images inside the docx! Use raw Buffer.
    const content = fs.readFileSync(sourcePath);
    const zip = new PizZip(content);
    
    let xml = zip.file("word/document.xml").asText();
    
    for (const [searchStr, replaceStr] of Object.entries(replacements)) {
        xml = replaceSplitText(xml, searchStr, replaceStr);
    }
    
    zip.file("word/document.xml", xml);
    
    const buf = zip.generate({ type: "nodebuffer", compression: "DEFLATE" });
    fs.writeFileSync(destPath, buf);
}

const replacements_depan = {
    "MUHAMMAD ABDULLAH": "{nama_lengkap}",
    "AHMAD": "{nama_panggilan}",
    "0706 / 3202211551": "{nisn}",
    "Laki-laki": "{jenis_kelamin}",
    "Tuban, 16 Mei 2020": "{tempat_tanggal_lahir}",
    "Islam": "{agama}",
    "1 (Satu)": "{anak_ke}",
    "GISO SISWOKO": "{nama_ayah}",
    "ROSITA SARI SIREGAR": "{nama_ibu}",
    "Wiraswasta": "{pekerjaan_ayah}",
    "Mengurus Rumah Tangga": "{pekerjaan_ibu}",
    "Dsn. Mojokopek  Rt.002 / Rw.030": "{alamat_jalan}",
    "081359092538": "{telepon}",
    "Prunggahan Kulon": "{desa}",
    "Semanding": "{kecamatan}",
    "Tuban": "{kabupaten}",
    "Jawa Timur": "{provinsi}"
};

createTemplate(
    path.join(__dirname, '..', 'LEMBAR DEPAN SAMA LEMBAR IDENTITAS.docx'),
    path.join(__dirname, 'public', 'template_depan.docx'),
    replacements_depan
);

const replacements_raport = {
    "BILKIS ANAJWA": "{nama_siswa}",
    "0636": "{nipd}",
    "101": "{tinggi_badan}",
    "14,20": "{berat_badan}",
    "I / 2025-2026": "{semester}",
    "Alhamdulillah di semester ini ananda BILKIS mengucap kalimat Thoyyibah sudah muncul Sebagian besar, melaksanakan atau mempraktekkan ibadah sehari-hari (Praktek sholat dhuha) sudah muncul Sebagian besar, berdoa sebelum dan sesudah melaksanakan kegiatan dengan tertib juga sudah muncul Sebagian besar. Untuk perkembangan budi pekerti yaitu mengembalikan benda yang tidak miliknya Ananda sudah muncul Sebagian besar, mengucap permisi jika mau lewat sudah muncul Sebagian besar.": "{teks_agama}</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val=\"center\"/></w:pPr><w:r><w:t>{#loop_agama}</w:t></w:r><w:r><w:t>{%foto_img}</w:t></w:r><w:r><w:t>{/loop_agama}",
    "Ananda untuk perkembangan jati diri misalnya melakukan permainan fisik dengan teratur muncul Sebagian besar, menggunakan alat tulis atau memegang pensil dengan benar muncul Sebagian besar, meniru gerakan senam fantasi muncul Sebagian besar, berdiri dengan tumit, berdiri dengan satu kaki dengan seimbang sudah muncul Sebagian besar, untuk sosial emosional misalnya sabar menunggu giliran Ananda sudah muncul Sebagian besar, mau ditinggal ibu tanpa menangis Ananda juga sudah muncul Sebagian besar.": "{teks_jati_diri}</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val=\"center\"/></w:pPr><w:r><w:t>{#loop_jati_diri}</w:t></w:r><w:r><w:t>{%foto_img}</w:t></w:r><w:r><w:t>{/loop_jati_diri}",
    "Ananda dalam perkembangan literasi atau bahasa, kognitif atau matematika, sains dan seni sudah muncul Sebagian besar. Diantaranya dalam bidang perkembangan Bahasa untuk melakukan 2-3 perintah sederhana Ananda sudah muncul Sebagian besar, menyebut Kembali 3-4 kata yang baru didengarnya Ananda sudah muncul Sebagian besar. Untuk perkembangan kognitif misalnya menyebut dan menunjukkan benda-benda yang berbentuk geometri sudah muncul Sebagian besar, menunjukkan urutan benda untuk bilangan 1-10 sudah muncul Sebagian besar, melukis dengan jari sudah muncul Sebagian besar, menyebutkan benda di sekitar sesuai dengan fungsinya Ananda juga sudah muncul Sebagian besar.": "{teks_literasi}</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val=\"center\"/></w:pPr><w:r><w:t>{#loop_literasi}</w:t></w:r><w:r><w:t>{%foto_img}</w:t></w:r><w:r><w:t>{/loop_literasi}",
    "Semester ini Ananda melakukan projek “Aku Sayang Bumi”, Melalui projek ini, diharapkan Ananda mengenal lingkungan serta memupuk kepedulian terhadap alam, mampu melakukan kegiatan secara bergotong royong, memperoleh dan mengolah informasi, serta menentukan pilihan dan mengambil keputusan di kehidupan sehari-hari dengan berbagai cara kreatif. Saat melaksanakan kegiatan projek, Ananda bisa melakukan kegiatan praktik secara bergotong royong, Ananda bisa menyiapkan bahan-bahan apa saja yang harus disiapkan untuk menanam biji jagung dengan sistem hidroponik. Adapun alat dan bahan yang harus di siapkan adalah gelas plastik, kapas, jagung dan air. Pertama-tama siapkan gelas kemudian taruh kapas didalamnya dan tuangkan biji jagung secukupnya sekitar 10 biji dan tuangkan air secukupnya sampai kapas meresap air. Setelah ini menunggu proses bertumbuhnya tunas sekitar 5 hari. Dengan kegiatan ini Ananda menunjukkan antusiasme yang luar biasa, ia mampu mengisi media tanam dengan rapi, Ananda terlihat tekun saat memasukkan benih dan bertanggung jawab dalam jadwal menyiram tanamannya setiap pagi. Kemampuan pengamatannya berkembang sangat baik, ia dapat menceritakan perubahan jagung dari tunas hingga tumbuh daun. Projek ini berhasil menumbuhkan rasa sayang Ananda terhadap makhluk hidup ciptaan Tuhan.": "{teks_projek}</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val=\"center\"/></w:pPr><w:r><w:t>{#loop_projek}</w:t></w:r><w:r><w:t>{%foto_img}</w:t></w:r><w:r><w:t>{/loop_projek}",
    "Sakit: 8": "Sakit: {sakit}",
    "Izin: 1": "Izin: {izin}",
    "Tanpa Keterangan: -": "Tanpa Keterangan: {tanpa_keterangan}",
    "TUNIK LUSTARI, S.Pd": "{guru_kelas}",
    "NPA. 13101200817": "NPA. {npa_guru}",
    "INDAH ROHMAWATI, S.Pd": "{kepala_tk}",
    "NPA. 13101200816": "NPA. {npa_kepala}"
};

createTemplate(
    path.join(__dirname, '..', 'isi raport', '1. BILKIS ANAJWA.docx'),
    path.join(__dirname, 'public', 'template_raport.docx'),
    replacements_raport
);
console.log("Done!");
