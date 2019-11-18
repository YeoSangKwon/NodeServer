const request = require('request');
const cheerio = require('cheerio');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('CP949', 'utf-8//translit//ignore');
// const iconv = new Iconv('UTF-8', 'EUC-KR//translit//ignore');


// DB연결
var mysql      = require('mysql');
var dbconfig   = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

const a = require('../comm/common');
const Data = require('../data/data');

let users = [
    {
      id: 1,
      name: 'alice'
    },
    {
      id: 2,
      name: 'bek'
    },
    {
      id: 3,
      name: 'chris'
    }
  ];

exports.index = (req, res) => {
    //Routing 로직 작성부분
    // console.log(a.aaa(2,2));

    console.log(req.url);
    if("/crawlingTest"==req.url){
      this.show(req, res);
    }else if("/dbconn"==req.url){
      this.databases(req, res);
    }else if("/dbselect"==req.url){
      this.selectMsg(req, res);
    }else{
      return res.json(users);
    }
};
  
exports.show = (req, res, next) => {
  // 주석부분은 인코딩 영화 목록 크롤링
  // let url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn";
  let url = "https://www.naver.com/";

  request({url, encoding: null}, function(error, response, body){
    // let htmlDoc = iconv.convert(body).toString();
    let resultArr = [];

    const $ = cheerio.load(body);
    let colArr = $('.ah_roll_area  > .ah_l > .ah_item > a > .ah_k');
    // let colArr = $('.title3');    
    // for(let i = 0; i < colArr.length; i++){
    //   // resultArr.push(colArr[i].children[1].attribs.title)
    //   resultArr.push(colArr[i].text);
    // }
    colArr.each((index, item) => {
      resultArr.push($(item).text());
    });
    
    res.json(resultArr);
    
  });
};


//데이터베이스 조회
exports.databases = (req, res) => {
  connection.query('SELECT * from Persons', function(err, rows) {
    if(err) throw err;

    let JsonArray  = new Array();
    for(let i in rows){
      jsonObject = new Object();

      jsonObject.id =  rows[i].id;
      jsonObject.name =  rows[i].name;
      jsonObject.age =  rows[i].age;

      JsonArray.push(jsonObject);
    }
    console.log(JsonArray);
    res.send(JSON.stringify(JsonArray));
  });

};

//푸쉬 메시지 내용 읽기
exports.selectMsg = (req, res) => {
  
  connection.query('SELECT * from pushMsg where sendYN !="Y" ORDER BY date DESC limit 1', function(err, rows) {
    if(err) throw err;

    if(rows.length == 0){
      return res.status(200).json({msg: 'no data'});
    }

    let JsonArray  = new Array();
    for(let i in rows){
      jsonObject = new Object();

      jsonObject.id =  rows[i].id;
      jsonObject.message =  rows[i].message;
      jsonObject.date =  rows[i].date;
      jsonObject.sendYN =  rows[i].sendYN;

      JsonArray.push(jsonObject);
    }
    console.log(JsonArray);
    res.send(JSON.stringify(JsonArray));
  });

};

exports.destroy = (req, res) => {

};
  

// POST (INSERT, UPDATE)
exports.post = (req, res) => {
  console.log(req.body.key);
  switch(req.body.key){
    case "user":
        InsertUser(req, res);
        break;
    case "push":
        InsertPush(req, res);
      break;
    case "select":
        selectUser(req, res);
  }

};

exports.update = (req, res) => {
  console.log('UPDATE pushMsg SET sendYN="Y" WHERE id = "'+req.body.id+'"');

  connection.query('UPDATE pushMsg SET sendYN="Y" WHERE id = "'+req.body.id+'"', function(err, rows) {
    if(err){
      return res.status(400).json({error: 'update fail'});
    } 
    console.log(rows);
    
    return res.status(200).json({msg: 'update success'});
  });
};

//받은 대로 보내주는 서비스
exports.api = (req, res) => {
  console.log(req.body);
  let jsonObject = new Object();
  jsonObject.result = req.body;
  
  res.send(JSON.stringify(jsonObject));
};

//USER TABLE 등록
const InsertUser = (req, res) => {
  const name = req.body.name || '';
  const age = req.body.age || '';

  if(!name.length || !age){
      console.log(req.body);
      return res.status(400).json({error: 'please insert value'});
  }

  connection.query('INSERT INTO Persons(name, age) VALUES ("'+name+'",'+ age+')', function(err, rows) {
    if(err){
      return res.status(400).json({error: 'Insert fail'});
    } 
    console.log(rows);
    
    return res.status(200).json({msg: 'Insert success'});
  });
}

//PUSH TABLE 등록
const InsertPush = (req, res) => {
  const message = req.body.message || '';
  
  if(!message.length){
      return res.status(400).json({error: 'please insert value'});
  }

  connection.query('INSERT INTO pushMsg(message) VALUES ("'+message+'")', function(err, rows) {
    if(err){
      return res.status(400).json({error: 'Insert fail'});
    } 
    console.log(rows);
    
    return res.status(200).json({msg: 'Insert success'});
  });
}

//데이터베이스 조회
const selectUser = (req, res) => {
  console.log(req.body)
  
  connection.query('SELECT * from Persons', function(err, rows) {
    if(err) throw err;

    let JsonArray  = new Array();
    for(let i in rows){
      jsonObject = new Object();

      jsonObject.id =  rows[i].id;
      jsonObject.name =  rows[i].name;
      jsonObject.age =  rows[i].age;

      JsonArray.push(jsonObject);
    }
    console.log(JsonArray);
    return res.status(200).send(JSON.stringify(JsonArray));
  });

};
