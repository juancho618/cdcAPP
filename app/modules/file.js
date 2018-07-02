
const fs = require('fs');
const pdf = require('html-pdf');
const options = { format: 'Legal' };
class File {


    htmlToPdf(filePath, targetPath, pdfName) {
        console.log('incomingList', file)
        if (i.toLowerCase().includes('.html')) {
            const html = fs.readFileSync(`${filePath}`, 'utf8');
            pdf.create(html, options).toFile(`${targetPath}/${pdfName}/.pdf`, (err, res) => {
                if (err) return console.log(err);
                fs.unlinkSync(`${filePath}`);
            });
        }
    }

}

module.exports = File;