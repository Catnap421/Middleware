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

router.post('/upload', multer({ dest: 'uploads/'}).array('pdf', 10), async function(req, res){
  logger.info('POST /upload');
  let result = [];
  let filename = [];

  for (let file of req.files) {
    const dataBuffer = fs.readFileSync(`./uploads/${file.filename}`)

    fs.unlinkSync(`./uploads/${file.filename}`);

    let hash = '';
    var did = '', issuerDID = '', signature = '';

    await pdf(dataBuffer).then(function(data) {
      const lines = [7, 8, 10, 12, 13, 14, 16, 18, 19, 21, 23];
      const pdfLines = data.text.split('\n');

      did = pdfLines[4].split(':')[2].trim();
      issuerDID = pdfLines[5].split(':')[2].trim();

      for(var line of lines) {
        let data = pdfLines[line];
        data = data.split(':');
      
        if(data[1].startsWith('#')) hash += data[1].trim().slice(1);
        else hash += crypto.createHash('sha256').update(data[1].trim()).digest('hex'); 
      }

      hash = crypto.createHash('sha256').update(hash).digest('hex');
      console.log('hash:',hash);
      signature = pdfLines[pdfLines.length - 1];
    });
    
    const query = require("./lib/query");

    const ddo = JSON.parse(await query("queryDDo", req.body.user, req.body.domain, issuerDID, req.body.apikey));
    const publicKey = ddo.publicKey[0]['publickeyPem'];

    const vc = JSON.parse(await query("queryVC", req.body.user, req.body.domain, did, req.body.apikey)); 
    const vc_signature = vc.proof.signature;
  
    // signature check
    if(signature !== vc_signature)
      logger.error('pdf signature and vc signature are not equal');
    
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(hash, 'ascii');

    const publicKeyBuf = Buffer.from(publicKey, 'ascii');
    const signatureBuf = Buffer.from(signature, 'base64');
    result.push(verifier.verify(publicKeyBuf, signatureBuf));
    filename.push(file.originalname);
    logger.debug(`filename: ${filename}, result: ${result}`);
  }

  res.render('result', {filename:filename, result:result});
})


module.exports = router;