const fs = require('fs');
let versionContent = fs.readFileSync('./src/enum/version.ts', 'utf8');
let version = versionContent.split('VERSIONS = \'')[1].split('\';')[0];
let versionTime = versionContent.split('VERSIONSTIME = \'')[1].split('\';')[0];
console.log('current version.ts file version:', version, ' ,versionTime:', versionTime);

/** 获取当前格式化的日期，格式为：YYYY-MM-DD */
const getCurrFormatDay = () => {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10)
    month = '0' + month;
  if (day < 10)
    day = '0' + day;

  return year + '' + month + '' + day;
}

const gitlabCITagName = process.argv[2] || process.env.CI_COMMIT_REF_NAME;
console.log('gitlabCITagName:', gitlabCITagName);
if (gitlabCITagName && typeof gitlabCITagName === 'string' && /^v/.test(gitlabCITagName)) {
  const nowVersion = gitlabCITagName.replace('v', '');
  console.log('gitlabCITagName replace after nowVersion:', nowVersion, ' ,version:', version);
  if (nowVersion !== version) {
    const nowVersionTime = getCurrFormatDay();
    console.log('CI tag nowVersion:', nowVersion);
    console.log('CI tag nowVersionTime:', nowVersionTime);
    versionContent = versionContent.replace(versionTime, nowVersionTime).replace(version, nowVersion);
    version = nowVersion;
    versionTime = nowVersionTime;
    console.log('CI tag versionContent:', versionContent);
    fs.writeFileSync('./src/enum/version.ts', versionContent, 'utf8');
  }
}

const packageJsonContent = fs.readFileSync('./package.json', 'utf8');
const packageJsonNewContent = packageJsonContent.replace(/"version": "\d+.\d+.\d+"/, `"version": "${version}"`);
fs.writeFileSync('./package.json', packageJsonNewContent, 'utf8');

const pubPackageJsonContent = fs.readFileSync('./build-after-file/package.json', 'utf8');
const pubPackageJsonNewContent = pubPackageJsonContent.replace(/"version": "\d+.\d+.\d+"/, `"version": "${version}"`);
fs.writeFileSync('./build-after-file/package.json', pubPackageJsonNewContent, 'utf8');
