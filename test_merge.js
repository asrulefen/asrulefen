const fs = require('fs');
const DocxMerger = require('@spfxappdev/docxmerger').DocxMerger;

try {
    const file1 = fs.readFileSync('public/template_depan_v2.docx', 'binary');
    const file2 = fs.readFileSync('public/template_raport_v2.docx', 'binary');

    // The package might export differently (default export vs named)
    // Let's try both
    const Merger = DocxMerger || require('@spfxappdev/docxmerger');

    var docx = new Merger({}, [file1, file2]);
    docx.save('nodebuffer', function (data) {
        fs.writeFileSync('test_merge.docx', data);
        console.log("Merge done");
    });
} catch(e) {
    console.error(e);
}
