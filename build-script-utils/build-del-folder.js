const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const rmdirAsync = async (filePath) => {
  let stat = await fsPromises.stat(filePath)
  if(stat.isFile()) {
    await fsPromises.unlink(filePath)
  }else {
    let dirs = await fsPromises.readdir(filePath)
    dirs = dirs.map(dir => rmdirAsync(path.join(filePath, dir)))
    await Promise.all(dirs)
    await fsPromises.rmdir(filePath)
  }
}

const rmdir = (dirpath)=>{
    console.log('start rmdir, dirpath:', dirpath);
    try{
        const isExist = fs.existsSync(dirpath);
        if (isExist){
            rmdirAsync(dirpath).then(() => {
                console.log('删除成功, dirpath:', dirpath);
            }).catch((err)=>{
                console.info('删除失败', err, ' ,dirpath:', dirpath);
            });
        }else{
            console.log(dirpath+' 是不存在的！');
        }
    }catch(err){
        console.info('rmdir err:', err, ' ,dirpath:', dirpath);
    }
}

const dirpaths = [
    path.resolve(__dirname, '../dist')
];

for(const dirpath of dirpaths){
    rmdir(dirpath);
}