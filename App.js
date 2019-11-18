const express = require('express');
const bodyParser = require('body-parser');
const routerLander = require('fs');
const app = express();
const port = 3001;
const FCM = require('fcm-node');
const serverKey = "AAAABcZxj68:APA91bH0iwQFR4zZqLfOH-x6chugAPmpM7QVxFu6qnzpp94QqKyzN77gVH4P05USLKzzs0HNNdqh9FEGXwyWa85Omq_Ul-RkGDuB88iXKNF3kYiJ4tmcwCf0AjO_BDDNCtUsmsgtuQQ3";
const client_token = "dl8a0aXMvas:APA91bEehbR6O9ydc0HVsu-CaAF_9wG1j8wRBBIL9pk8VUrNUGbL3tk5OF_R-gTcZ0lTpd2kdF-wsMs4Pns7908c-Q6dypaXhd24VUfFcoXkutcbQbmybSQ3cCr_iBxWX2_sGc-tbaL_";
const fcm = new FCM(serverKey);

const multer = require('multer');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', require('./api/user'));
app.use('/crawling', require('./api/crawling'));
// app.use('/fileSend', require('./api/fileSend'));
app.use(express.static('./api/www/'));

var allowCORS = function(req, res, next) {
  res.header('Acess-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Content-Type','text/plain; charset=utf-8');
  (req.method === 'OPTIONS') ?
    res.send(200) :
    next();
};

// 크로스 브라우징 적용
app.use(allowCORS);

// 서버 가동
app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});


// root 호출 시 표시되는 화면
app.get("/", function(req, res){
  req.accepts('text/plan');
  routerLander.readFile('./api/www/html/index.html', function(error, data){
    if(error){
      console.log(error);
    }else{
      res.writeHead(200, {'Content-Type':'text/html'});
      res.end(data);
    }
  });
});


routerLander.readdir('upload',(error)=>{
  if(error){
      console.error('upload 폴더가 없어서 폴더를 생성합니다.');
      fs.mkdirSync('upload')
  }
});

////////////////////////////////////// 파일업로드///////////////////////////////////
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
  limits:{fileSize: 5 * 1024 * 1024}
});

app.post('/upload', upload.single('userfile'), (req, res)=>{
  console.log(req.file);
  res.send('Uploaded! : '+req.file);
});

/////////////////////////////////////////////////////////////////////////////////////

app.get("/kakao", function(req, res){
  req.accepts('text/plan');
  routerLander.readFile('./api/www/html/map.html', function(error, data){
    if(error){
      console.log(error);
    }else{
      res.writeHead(200, {'Content-Type':'text/html'});
      res.end(data);
    }
  });
});


let pust_data = {
  // 수신대상 (지정)
  // to: client_token,

  // 수신대상 (주제)
  to : "/topics/weather",
  // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
  // notification: {
  //     title: "Push Message",
  //     body: ""
  // },
  // App 패키지 이름
  restricted_package_name: "md.ysk5898.com",
  // App에게 전달할 데이터
  data: {
      title: "Push Message",
      body: ""
  }
};

//푸시전송 
app.get("/pushSend", function(req, res){
  console.log(req.query.body);
  pust_data.data.body = req.query.body;
  
  fcm.send(pust_data, function(err, response) {
      if (err) {
          console.error('Push메시지 발송에 실패했습니다.');
          console.error(err);
      }else{
        console.log('Push메시지가 발송되었습니다.');
        console.log(response);
      }
    });

    return res.status(200).json({msg: 'Push Send Success'});
    
  });
  

