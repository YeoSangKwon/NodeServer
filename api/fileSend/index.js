const express = require('express');
const router = express.Router();
const controller = require('./controller');
const app = express();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

fs.readdir('upload',(error)=>{
    if(error){
        console.error('upload 폴더가 없어서 폴더를 생성합니다.');
        fs.mkdirSync('upload')
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
      }),
    limits:{fileSize: 5 * 1024 * 1024}
});

app.post('/upload', upload.single('img'), (req, res)=>{
    console.log(req.file);
    return res.status(200).json({msg: 'Insert success'});
});



module.exports = router;