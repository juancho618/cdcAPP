const fs = require('fs');
const pathjs = require('path');


class Directory {
    constructor() {
        this.files = [];
    }
    read(path) {
        const fileList = fs.readdirSync(path);
        this.files = fileList.map(file => {
            const stats = fs.statSync(`${path}/${file}`);
            const ext = pathjs.extname(`${path}/${file}`);
            return {
                name: file,
                stats: stats, 
                ext: ext ? ext : 'directory'
            }
        })
    }
}
// let fileList = {
//     readDirectory: async (path) => {
//         return fs.readdir(path, (err, files) =>{
//             if (err) return console.log(err);
//             console.log('those are the files', files);
//             return files;
//         })
//     }
// }

module.exports = Directory;