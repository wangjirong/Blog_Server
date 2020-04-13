const multer = require('multer');
const OSS = require('ali-oss')
const fs = require('fs');
const uploadsResource = require('./config/uploadsResource')
let client = new OSS({
    region: uploadsResource.region,
    accessKeyId: uploadsResource.accessKeyId,
    accessKeySecret: uploadsResource.accessKeySecret,
    bucket: uploadsResource.bucket
})
client.useBucket(uploadsResource.bucket)

function getStorageTime(folder) {
    let time = '';
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, folder);
        },
        filename: (req, file, callback) => {
            time = Date.now() + '-';
            callback(null, time + file.originalname);
        }
    })
    return {
        storage,
        time
    }
}
async function uploadImage(fileName, filePath) {
    try {
        let result = await client.put(fileName, filePath)
        return result
    } catch (error) {
        throw error;
    }
}

async function deleteImage(filePath){
    try{
        fs.unlinkSync(filePath)
    }catch(error){
        throw error;
    }
}

module.exports = {
    uploadImage,
    getStorageTime,
    deleteImage
}