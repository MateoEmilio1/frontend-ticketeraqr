const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const folder = 'C:\\Users\\migue\\OneDrive\\Documents\\Facultad\\Seminario\\CUs_en_PDF\\CUs en PDF';
const files = fs.readdirSync(folder).filter(f => f.endsWith('.pdf'));

(async () => {
    for (const file of files.sort()) {
        console.log('\n\n==============================');
        console.log('FILE:', file);
        console.log('==============================');
        try {
            const buf = fs.readFileSync(path.join(folder, file));
            const data = await pdfParse(buf);
            console.log(data.text);
        } catch (e) {
            console.error('Error:', e.message);
        }
    }
})();
