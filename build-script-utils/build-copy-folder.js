const fs = require('fs');
const path = require('path');

function copy(from, to) {
    const fromPath = path.resolve(from);
    const toPath = path.resolve(to);
    fs.access(toPath, function (err) {
        if (err) {
            fs.mkdirSync(toPath);
        }
    })
    fs.readdir(fromPath, function (err, paths) {
        if (err) {
            console.log(err);
            return
        }
        paths.forEach(function (item) {
            const newFromPath = fromPath + '/' + item;
            const newToPath = path.resolve(toPath + '/' + item);

            fs.stat(newFromPath, function (err, stat) {
                if (err) return;
                if (stat.isFile()) {
                    copyFile(newFromPath, newToPath);
                    console.log(newToPath);
                }
                if (stat.isDirectory()) {
                    copy(newFromPath, newToPath);
                }
            })
        })
    })
}

function copyFile(from, to) {
    try{
        fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    }catch(err){
        console.info('copyFile err:', err);
    }
}


const dirpaths = [
];

for(const dirpath of dirpaths){
    copy(dirpath[0], dirpath[1]);
}