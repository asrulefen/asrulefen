from docx import Document

doc = Document(r"C:\Users\evn\Videos\aplikasi raport tk pgri\isi raport\1. BILKIS ANAJWA.docx")

for t_idx, table in enumerate(doc.tables):
    print(f"--- Table {t_idx} ---")
    for r_idx, row in enumerate(table.rows):
        print(f"Row {r_idx}:")
        for c_idx, cell in enumerate(row.cells):
            # Print only first 30 chars of the cell text
            text = cell.text.replace('\n', ' ')
            print(f"  Cell {c_idx}: {text[:50]}...")
