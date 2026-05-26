import zipfile
import re
import os
import shutil

# This script replaces specific texts in the XML of docx to create docxtemplater tags.
# Note: Word often splits text into multiple <w:t> tags. 
# We will use a regex that matches text ignoring XML tags between characters!
def create_template(source_path, dest_path, replacements):
    print(f"Creating template {dest_path} from {source_path}")
    temp_dir = dest_path + "_temp"
    
    with zipfile.ZipFile(source_path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)
        
    xml_path = os.path.join(temp_dir, "word", "document.xml")
    with open(xml_path, 'r', encoding='utf-8') as f:
        xml_content = f.read()

    # Function to replace text that might be split by XML tags
    def replace_split_text(xml, search_str, replace_str):
        # Create a regex that allows <w:...> tags between each character of the search_str
        pattern = ""
        for i, char in enumerate(search_str):
            if char in "()[]{}.*+?^$|\\":
                char = "\\" + char
            pattern += char
            if i < len(search_str) - 1:
                pattern += r"(?:<[^>]+>)*"
        
        # We replace the whole matched sequence with the replacement string. 
        # This will destroy any formatting that was inside the matched word, but for templates it's usually fine.
        return re.sub(pattern, replace_str, xml)

    for search_str, replace_str in replacements.items():
        xml_content = replace_split_text(xml_content, search_str, replace_str)

    # For the paragraphs, we might want to just replace a known snippet with a block tag or text tag.
    
    with open(xml_path, 'w', encoding='utf-8') as f:
        f.write(xml_content)
        
    # Re-zip
    with zipfile.ZipFile(dest_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, temp_dir)
                zipf.write(file_path, arcname)
                
    shutil.rmtree(temp_dir)

# Replacements for Lembar Depan
replacements_depan = {
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
}

create_template(
    r"c:\Users\evn\Videos\aplikasi raport tk pgri\LEMBAR DEPAN SAMA LEMBAR IDENTITAS.docx", 
    r"c:\Users\evn\Videos\aplikasi raport tk pgri\app-raport\public\template_depan.docx", 
    replacements_depan
)

# Replacements for Raport
# We will just replace the specific paragraphs that Gemini will generate.
replacements_raport = {
    "BILKIS ANAJWA": "{nama_siswa}",
    "0636": "{nipd}",
    "101": "{tinggi_badan}",
    "14,20": "{berat_badan}",
    "I / 2025-2026": "{semester}",
    "Alhamdulillah di semester ini ananda BILKIS mengucap kalimat Thoyyibah sudah muncul Sebagian besar, melaksanakan atau mempraktekkan ibadah sehari-hari (Praktek sholat dhuha) sudah muncul Sebagian besar, berdoa sebelum dan sesudah melaksanakan kegiatan dengan tertib juga sudah muncul Sebagian besar. Untuk perkembangan budi pekerti yaitu mengembalikan benda yang tidak miliknya Ananda sudah muncul Sebagian besar, mengucap permisi jika mau lewat sudah muncul Sebagian besar.": "{teks_agama}",
    "Ananda untuk perkembangan jati diri misalnya melakukan permainan fisik dengan teratur muncul Sebagian besar, menggunakan alat tulis atau memegang pensil dengan benar muncul Sebagian besar, meniru gerakan senam fantasi muncul Sebagian besar, berdiri dengan tumit, berdiri dengan satu kaki dengan seimbang sudah muncul Sebagian besar, untuk sosial emosional misalnya sabar menunggu giliran Ananda sudah muncul Sebagian besar, mau ditinggal ibu tanpa menangis Ananda juga sudah muncul Sebagian besar.": "{teks_jati_diri}",
    "Ananda dalam perkembangan literasi atau bahasa, kognitif atau matematika, sains dan seni sudah muncul Sebagian besar. Diantaranya dalam bidang perkembangan Bahasa untuk melakukan 2-3 perintah sederhana Ananda sudah muncul Sebagian besar, menyebut Kembali 3-4 kata yang baru didengarnya Ananda sudah muncul Sebagian besar. Untuk perkembangan kognitif misalnya menyebut dan menunjukkan benda-benda yang berbentuk geometri sudah muncul Sebagian besar, menunjukkan urutan benda untuk bilangan 1-10 sudah muncul Sebagian besar, melukis dengan jari sudah muncul Sebagian besar, menyebutkan benda di sekitar sesuai dengan fungsinya Ananda juga sudah muncul Sebagian besar.": "{teks_literasi}",
    "Semester ini Ananda melakukan projek “Aku Sayang Bumi”, Melalui projek ini, diharapkan Ananda mengenal lingkungan serta memupuk kepedulian terhadap alam, mampu melakukan kegiatan secara bergotong royong, memperoleh dan mengolah informasi, serta menentukan pilihan dan mengambil keputusan di kehidupan sehari-hari dengan berbagai cara kreatif. Saat melaksanakan kegiatan projek, Ananda bisa melakukan kegiatan praktik secara bergotong royong, Ananda bisa menyiapkan bahan-bahan apa saja yang harus disiapkan untuk menanam biji jagung dengan sistem hidroponik. Adapun alat dan bahan yang harus di siapkan adalah gelas plastik, kapas, jagung dan air. Pertama-tama siapkan gelas kemudian taruh kapas didalamnya dan tuangkan biji jagung secukupnya sekitar 10 biji dan tuangkan air secukupnya sampai kapas meresap air. Setelah ini menunggu proses bertumbuhnya tunas sekitar 5 hari. Dengan kegiatan ini Ananda menunjukkan antusiasme yang luar biasa, ia mampu mengisi media tanam dengan rapi, Ananda terlihat tekun saat memasukkan benih dan bertanggung jawab dalam jadwal menyiram tanamannya setiap pagi. Kemampuan pengamatannya berkembang sangat baik, ia dapat menceritakan perubahan jagung dari tunas hingga tumbuh daun. Projek ini berhasil menumbuhkan rasa sayang Ananda terhadap makhluk hidup ciptaan Tuhan.": "{teks_projek}",
    "Sakit: 8": "Sakit: {sakit}",
    "Izin: 1": "Izin: {izin}",
    "Tanpa Keterangan: -": "Tanpa Keterangan: {tanpa_keterangan}",
    "TUNIK LUSTARI, S.Pd": "{guru_kelas}",
    "NPA. 13101200817": "NPA. {npa_guru}",
    "INDAH ROHMAWATI, S.Pd": "{kepala_tk}",
    "NPA. 13101200816": "NPA. {npa_kepala}"
}

create_template(
    r"c:\Users\evn\Videos\aplikasi raport tk pgri\isi raport\1. BILKIS ANAJWA.docx", 
    r"c:\Users\evn\Videos\aplikasi raport tk pgri\app-raport\public\template_raport.docx", 
    replacements_raport
)
print("Done!")
