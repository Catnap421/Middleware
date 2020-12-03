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

// router.post('/upload', multer({ dest: 'uploads/'}).array('pdf', 10), async function(req, res){
//   logger.info('POST /upload');
//   let result = [];
//   let filename = [];

//   for (let file of req.files) {
//     const dataBuffer = fs.readFileSync(`./uploads/${file.filename}`)

//     fs.unlinkSync(`./uploads/${file.filename}`);

//     let hash = '';
//     var did = '', issuerDID = '', signature = '';

//     await pdf(dataBuffer).then(function(data) {
//       const lines = [7, 8, 10, 12, 13, 14, 16, 18, 19, 21, 23];
//       const pdfLines = data.text.split('\n');

//       did = pdfLines[4].split(':')[2].trim();
//       issuerDID = pdfLines[5].split(':')[2].trim();

//       for(var line of lines) {
//         let data = pdfLines[line];
//         data = data.split(':');
      
//         if(data[1].startsWith('#')) hash += data[1].trim().slice(1);
//         else hash += crypto.createHash('sha256').update(data[1].trim()).digest('hex'); 
//       }

//       hash = crypto.createHash('sha256').update(hash).digest('hex');
//       console.log('hash:',hash);
//       signature = pdfLines[pdfLines.length - 1];
//     });
    
//     const query = require("./lib/query");
//     let ddo, publicKey, vc, vc_signature;
//     try{
//       ddo = JSON.parse(await query("queryDDo", req.body.user, req.body.domain, [issuerDID], req.body.apikey));
//       publicKey = ddo[0].DDo.publicKey[0]['publickeyPem'];
      

//       vc = JSON.parse(await query("queryVC", req.body.user, req.body.domain, [did], req.body.apikey)); 
//       vc_signature = vc[0].DDo.proof.signature;
//     } catch(error) {
//       logger.error('Verification Error!');
//       result.push('미등록');
//       filename.push(file.originalname);
//       continue;
//     }
//     // signature check
//     if(signature !== vc_signature) {
//       logger.error('pdf signature and vc signature are not equal');
//       result.push('pdf signature and vc signature are not equal');
//       filename.push(file.originalname);
//       continue;
//     }
    
//     const verifier = crypto.createVerify('RSA-SHA256');
//     verifier.update(hash, 'ascii');

//     const publicKeyBuf = Buffer.from(publicKey, 'ascii');
//     const signatureBuf = Buffer.from(signature, 'base64');
//     result.push(verifier.verify(publicKeyBuf, signatureBuf) ? "성공" : "@실패@");
//     filename.push(file.originalname);
//     logger.debug(`filename: ${filename}, result: ${result}`);
//   }

//   res.render('result', {filename:filename, result:result});
// })

router.post('/upload', multer({ dest: 'uploads/'}).array('pdf', 100), async function(req, res){
  logger.info('POST /upload');
  let result = [];
  let filename = [];

  let dids = [], hashes = [], issuerDIDs = [], signatures = [];

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

      dids.push(did);
      signatures.push(signature);
      issuerDIDs.push(issuerDID);
      hashes.push(hash);
    });
  
  }
  const query = require("./lib/query");
  let DDos, VCs;
  DDos = JSON.parse(await query("queryDDo", req.body.user, req.body.domain, issuerDIDs, req.body.apikey));
  VCs = JSON.parse(await query("queryVC", req.body.user, req.body.domain, dids, req.body.apikey)); 

  req.files.map((file, idx) => {
    if(VCs.result[idx].DDo == "Key error") {
      logger.error("Wrong PDF. Because PDF's key is not matched");
      result.push('Wrong KEY');
      filename.push(file.originalname);
    }
    else {
      let publicKey = DDos.result[idx].DDo.publicKey[0]['publickeyPem'];
      let vc_signature = VCs.result[idx].DDo.proof.signature;

      if(signature !== vc_signature)  {
          logger.error("Wrong PDF. Because PDF's signature is not matched");
          result.push('Wrong PDF');
          filename.push(file.originalname);
      } else {
        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(hashes[idx], 'ascii');

        const publicKeyBuf = Buffer.from(publicKey, 'ascii');
        const signatureBuf = Buffer.from(signatures[idx], 'base64');
        result.push(verifier.verify(publicKeyBuf, signatureBuf) ? "성공" : "@실패@");
        filename.push(file.originalname);
      }
    }
    logger.debug(`filename: ${filename}, result: ${result}`);
  })

  res.render('result', {filename:filename, result:result});
})


module.exports = router;