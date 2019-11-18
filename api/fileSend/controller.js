const multer = require('multer');
const path = require('path');
const fs = require('fs');


exports.index = (req, res) => {
    fs.readdir('upload',(error)=>{
        if(error){
            console.error('upload 폴더가 없어서 폴더를 생성합니다.');
            fs.mkdirSync('upload')
        }
    })
    return res.json("TEST controller");
};