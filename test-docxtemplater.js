const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module-free');
const { DOMParser } = require('xmldom');

try {
  const contentRaport = fs.readFileSync(path.resolve(__dirname, 'public/template_raport_v2.docx'));
  const zipRaport = new PizZip(contentRaport);
  
  const opts = {
    centered: false,
    getImage(tagValue) {
      return Buffer.from('');
    },
    getSize(img, tagValue, tagName, context) {
      return [160, 120]; 
    },
  };
  
  const docRaport = new Docxtemplater(zipRaport, {
    paragraphLoop: true,
    linebreaks: true,
    modules: [new ImageModule(opts)]
  });
  
  docRaport.render({
      teks_agama: "Test",
      teks_jati_diri: "Test",
      teks_literasi: "Test",
      teks_projek: "Test",
      loop_agama: [],
      loop_jati_diri: [],
      loop_literasi: [],
      loop_projek: []
  });
  
  const buf = docRaport.getZip().generate({ type: 'nodebuffer' });
  fs.writeFileSync('output-test.docx', buf);
  
  // Validate XML
  const outZip = new PizZip(buf);
  const xml = outZip.file('word/document.xml').asText();
  const parser = new DOMParser({errorHandler:{
      error: e => console.log('XML Error:', e),
      fatalError: e => console.log('XML Fatal:', e)
  }});
  parser.parseFromString(xml, 'text/xml');
  console.log("Success! File saved to output-test.docx. Valid XML.");
} catch (error) {
  if (error.properties && error.properties.errors) {
    console.log("Multi Error Details:", JSON.stringify(error.properties.errors, null, 2));
  } else {
    console.log("Error:", error);
  }
}
