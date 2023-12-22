const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const copyFileAsync = async (srcFilePath, destDir, destFileName) => {
    await fsPromises.copyFile(srcFilePath, destDir+'\/'+destFileName);
}

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname))
    {
        return true;
    }

    if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
    }
}

const copyFile = (srcFilePath, destDir, destFileName)=>{
    console.log('start copyFiles,srcFilePath:', srcFilePath, ' ,destDir:', destDir, ' ,destFileName:', destFileName);
    try{
        if (!fs.existsSync(destDir)) {
            console.log('目标目录不存在，需要创建, destDir:', destDir);
            mkdirsSync(destDir);
        }
        copyFileAsync(srcFilePath, destDir, destFileName).then(() => {
            console.log('拷贝文件成功,  srcFilePath:', srcFilePath, ' ,destDir:', destDir, ' ,destFileName:', destFileName);
        }).catch((err)=>{
            console.info('拷贝文件失败', err, ' ,srcFilePath:', srcFilePath, ' ,destDir:', destDir, ' ,destFileName:', destFileName);
        });
    }catch(err){
        console.info('copyFile err:', err, ' ,srcFilePath:', srcFilePath, ' ,destDir:', destDir, ' ,destFileName:', destFileName);
    }
}

const copyFilePaths = [
    [path.resolve(__dirname, '../build-after-file/package.json'), path.resolve(__dirname, '../dist'), 'package.json'],
    [path.resolve(__dirname, '../build-after-file/README.md'), path.resolve(__dirname, '../dist'), 'README.md']
];

for(const copyFilePath of copyFilePaths){
    copyFile(copyFilePath[0], copyFilePath[1], copyFilePath[2]);
}