
const fs = require('fs');
const pdf = require('html-pdf');
const path = './htmlFiles/';
const options = { format: 'Legal' };
class File {


    htmlToPdf(path) {
        fs.readdir(path, (err, items) => {
            if (items.length > 0) {
                items.forEach(i => {
                    if (i.toLowerCase().includes('.html')) {
                        const fileName = i.replace('.html', '');
                        const html = fs.readFileSync(path + i, 'utf8');
                        pdf.create(html, options).toFile('./pdfFiles/' + fileName + '.pdf', (err, res) => {
                            if (err) return console.log(err);
                            fs.unlinkSync(path + i);
                        });
                    }
                })
            }
        });
    }

}

module.exports = File;