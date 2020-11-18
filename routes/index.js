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

  const hash = '';
  const did = '';
  const controllerDID = '';
  const signature = '';

  pdf(dataBuffer).then(function(data) {
    const lines = [7, 8, 10, 12, 13, 14, 16, 18, 19, 21, 23];
    const pdfLines = data.text.split('\n');

    pdfLines.map((el, idx) => console.log(`${idx}:${el}`))

    did = pdfLines[3];
    controllerDID = pdfLines[4];

    for(var line of lines) {
      console.log(pdfLines[line]);
      let data = pdfLines[line];
      data = data.split(':');
      // trim을 통해 공백 제거해줘야 함
      if(data[1].startsWith('#')) hash += data[1].trim().slice(1);
      else hash += crypto.createHash('sha256').update(data[1].trim()).digest('hex'); 
    }

    hash = crypto.createHash('sha256').update(hash).digest('hex');
    console.log('hash:', hash)
    signature = pdfLines[pdfLines.length - 1];
  });
  /*
    var hash = '';
    for(var [key, value] of Object.entries(data.Claim))
        hash += crypto.createHash('sha256').update(value).digest('hex');
    
    hash = crypto.createHash('sha256').update(hash).digest('hex');
  */ 

  // 파일 읽기 -> 분해해서 질의
  const query = require("./lib/query");
  const ddo = query("queryDDo", req.body.user, req.body.domain, controllerDID, req.body.apikey);
  // const publicKey = ddo.proof.public

  const vc = query("queryVC", req.body.user, req.body.domain, did, req.body.apikey); // await가 안 먹히는 이유가 뭐지?

    /*
   const verifier = crypto.createVerify('RSA-SHA256')

    verifier.update(hash, 'ascii')

    const publicKeyBuf = Buffer.from(publicKey, 'ascii')
    const signatureBuf = Buffer.from(vc.signature, 'base64')
    const result = verifier.verify(publicKeyBuf, signatureBuf)
  */

  res.status(204).send();
})

router.get('/result', function(req, res){
  res.render('result');
})



module.exports = router;