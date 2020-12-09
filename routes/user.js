const express = require("express");
const router = express.Router();
const logger = require(process.cwd()+'/config/winston');

const { apiLimiter, deprecated} = require('./rateLimit');

router.get('/test', function(req, res){
  logger.info('GET /user/test');
  res.status(200).send("testing success!!");
})

router.get('/ddo/:did', apiLimiter, async function(req, res) { 
  const query = require("./lib/query");
  logger.info('GET /user/ddo/:did');
  const path = req.path.split('/')[2].split('%2C');
  logger.info("/ddo/:did -", path)
  const ret = JSON.parse(await query("queryDDo", req.query.user, req.query.domain, path, req.headers.apikey));
  if(!ret.hasOwnProperty('status')) res.status(200).json(ret);
  else if(ret.status === 401) res.status(401).send('Unauthorized');
  else res.status(404).send('Error');
});

router.get('/vc/:did', apiLimiter, async function(req, res) { 
  const query = require("./lib/query");
  logger.info('GET /user/vc/:did');
  const path = req.path.split('/')[2].split('%2C');
  logger.info("/vc/:did -", path)
  const ret = JSON.parse(await query("queryVC", req.query.user, req.query.domain, path, req.headers.apikey));
  if(!ret.hasOwnProperty('status')) res.status(200).json(ret);
  else if(ret.status === 401) res.status(401).send('Unauthorized');
  else res.status(404).send('Error');
});

router.post('/apikey', async function(req,res) {
  const recoverApiKey = require("./lib/recoverApiKey");
  logger.info('POST user/apikey');
  const ret = await recoverApiKey(req.body);
  if(!ret.hasOwnProperty('status'))  res.status(200).send(`Successfully Recover APIKey.\nThe APIKey: ${apiKey}`);
  else if(ret.status === 401) res.status(401).send('Register admin first');
  else res.status(400).send('Invalid UUID');
 
})

  
module.exports = router