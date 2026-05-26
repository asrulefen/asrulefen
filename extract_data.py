from docx import Document
import os
import json

folder = r"C:\Users\evn\Videos\aplikasi raport tk pgri\isi raport"
files = [f for f in os.listdir(folder) if f.endswith('.docx')]

students = []
for file in files:
    doc = Document(os.path.join(folder, file))
    student = {"file": file}
    for table in doc.tables:
        for row in table.rows:
            cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if not cells: continue
            
            # Simple heuristic for key-value in tables
            for i, c in enumerate(cells):
                if c.strip() == "NamaSiswa" and i + 1 < len(cells):
                    student["nama_lengkap"] = cells[i + 1].strip()
                elif c.strip() in ["NIPD", "NISN"] and i + 1 < len(cells):
                    student["nisn"] = cells[i + 1].strip()
                elif c.strip() == "Kelompok" and i + 1 < len(cells):
                    student["kelompok"] = cells[i + 1].strip()
                elif c.strip() == "Tinggi Badan" and i + 1 < len(cells):
                    student["tinggi_badan"] = cells[i + 1].strip()
                elif c.strip() == "Berat Badan" and i + 1 < len(cells):
                    student["berat_badan"] = cells[i + 1].strip()
            
            # Extract narrative paragraphs to find indicators
            text = cells[0]
            if "Alhamdulillah di semester ini ananda" in text or "Ananda untuk perkembangan jati diri" in text or "Ananda dalam perkembangan literasi" in text or "Semester ini Ananda melakukan projek" in text:
                cat = "UNKNOWN"
                if "Thoyyibah" in text or "ibadah" in text: cat = "AGAMA"
                elif "permainan fisik" in text or "emosional" in text: cat = "JATI_DIRI"
                elif "literasi atau bahasa" in text or "kognitif" in text: cat = "LITERASI"
                elif "projek" in text.lower(): cat = "PROJEK"
                
                if cat not in student:
                    student[cat] = text

    students.append(student)

print(json.dumps(students, indent=2))
