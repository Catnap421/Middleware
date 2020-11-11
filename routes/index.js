const express = require("express");
const router = express.Router();
const multer = require('multer');
const logger = require(process.cwd()+'/config/winston');
const network = require("fabric-network")

router.get('/', function(req, res){
  console.log("START /");
  res.render('index');
})

router.post('/upload', multer({ dest: 'uploads/'}).single('file'), function(req, res){
  logger.info(`req.body is ${req.body.user}, ${req.body.domain}, ${req.body.apikey}`);
  logger.info(`req.file is ${req.file}`);
  // 파일 읽기 -> 분해해서 질의
  // const query = require("./lib/query");
  // logger.info('GET /user/vc/:did');
  // const path = req.path.split('/')[2];
  // const ret = query("queryVC", req.query.user, req.query.domain, path, req.headers.apikey); // await가 안 먹히는 이유가 뭐지?
  // if(!ret.hasOwnProperty('status')) res.status(200).json(ret.toString());
  // else if(ret.status === 401) res.status(401).send('Unauthorized');
  // else res.status(404).send('Error');
  res.status(204).send();
})

router.get('/result', function(req, res){
  res.render('result');
})



module.exports = router;