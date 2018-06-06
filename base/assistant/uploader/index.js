//local system upload 로직과 s3 업로드 로직 이곳에서 구현할것 ...

exports.upload = upload;

const sharp = require('sharp');
const replaceall = require('replaceall');
const moment = require('moment');
// const local = require('./local');
const s3 = require('./s3');

async function upload(req, inspectedObj, toValidateFile) {
    try {
        const { inspectedFiles, inspectedFields } = inspectedObj;  
        req.files = {};

        for (let key of Object.keys(inspectedFiles)) {

            const { buffer, fileName } = inspectedFiles[key];            
            const { target, subDir, thumbnail } = toValidateFile[key]['upload'];
                                    
            if (target === 's3') {
                const renamedSubDir = renameSubDir(subDir);
                const { ETag, Location, Bucket, Key } = await s3.fileUpload(fileName, buffer, renamedSubDir);
                req.files[key] = { 
                    target: 's3',
                    fileName : fileName
                };
                req.files[key].file = {
                    ETag: ETag,
                    Location: Location,                    
                    Key: Key,
                    Bucket: Bucket,                    
                };
                if (thumbnail) {
                    const { subDir, width, height } = thumbnail;
                    const renamedSubDir = renameSubDir(subDir);
                    const resizedBuffer = await resizeBuffer(buffer, width, height);
                    const { ETag, Location, Bucket, Key } = await s3.fileUpload(fileName, resizedBuffer, renamedSubDir);
                    req.files[key].thumbnail = {
                        ETag: ETag,
                        Location: Location,
                        Key: Key,
                        Bucket: Bucket,
                    }
                    
                }                
            }

            
        }

        req.fields = {};
        for (let key of Object.keys(inspectedFields)) {            
            const paramVal = inspectedFields[key];
            req.fields[key] = paramVal;
        }

    } catch (err) {
        
        throw err;
    }
}

function renameSubDir(subDir){
    if (subDir) {
        if (subDir.search('[today]') !== -1) {
            subDir = replaceall('[today]', moment().format('YYYYMMDD'), subDir);
        }
    } 
    return subDir;
}

async function resizeBuffer(buffer, width, height) {
    const resizedBuffer = await sharp(buffer)
                                    .resize(width, height)
                                    .toBuffer();
    return resizedBuffer;
}
