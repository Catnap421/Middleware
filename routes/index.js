const express = require("express");
const router = express.Router();
const multer = require('multer');
const logger = require(process.cwd()+'/config/winston');
const crypto = require('crypto');
const fs = require('fs');
const pdf = require('pdf-parse');

router.get('/', function(req, res){
  console.log("START /");
  res.render('index');
})

router.post('/upload', multer({ dest: 'uploads/'}).single('file'), function(req, res){
  logger.info(`req.body is ${req.body.user}, ${req.body.domain}, ${req.body.apikey}`);
  logger.info(`req.file is ${req.file}`);
  const dataBuffer = fs.readFileSync(`./uploads/${req.file.filename}`);

  pdf(dataBuffer).then(function(data) {
    console.log('data.text:');
    var arr = data.text.split('\n');
    var i = 0;
    arr.forEach(el => console.log(`${++i}: ${el}`));
  });
  // 여기에서 did를 뽑아내야 함
  let did = 'exampleCert57228'
  // 파일 읽기 -> 분해해서 질의
  const query = require("./lib/query");


  const ret = query("queryVC", req.body.user, req.body.domain, did, req.body.apikey); // await가 안 먹히는 이유가 뭐지?
  console.log(ret)
  res.status(204).send();
})

router.get('/result', function(req, res){
  res.render('result');
})



module.exports = router;