const http = require('http');
const fs = require('fs');
const XLSX = require('xlsx');

// Parameter for the matrix request from ELO server
const options = {
    hostname: 'SRV-ELO01',
    port: 9090,
    path: '/ix-CDC/ix?cmd=readdoc1&encrobjid=%23%23AES%23%23rdZcnKYNAgWNKCb7dUo0m8t9Sj4ntOJMOOlehjooqlm41HuKrpkgRAc0BndF5RRapa2g%2Bsd%2FX6CiUQeherIedZgucGak4dfPAMd31UbYDR8%3D&acode=attachment&fname=trucks+contracts+matrix++mail+merge+source++current.xlsm',
    method: 'GET',
    headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
}

class Matrix {
    constructor() {
        this.path = './app/data/trucksMatrix.xlsm';
    }

    importMatrix() {
        
        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('base64');
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                fs.writeFileSync(this.path, data, 'base64');
                console.log('File dowloaded!.');
            });

        });

        req.end();
    }

    getHeaders() {
        const workbook = XLSX.readFile(this.path);
        const sheet_name_list = workbook.SheetNames;
        const sheet = workbook.Sheets["Tabelle1"];
        
        let headers = [];
        let range = XLSX.utils.decode_range(sheet['!ref']);
        let C, R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for(C = range.s.c; C <= range.e.c; ++C) {
            const cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */
    
            let hdr = "UNKNOWN " + C; 
            if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    
            headers.push(hdr);
        }
        
        return headers.filter( attr => !attr.includes('UNKNOWN'));
        
        
    }



}

module.exports = Matrix;