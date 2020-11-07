const express = require("express");
const router = express.Router();
const network = require("fabric-network")
const logger = require(process.cwd()+'/config/winston');

router.post('/', async function(req, res) {  
  const enroll = require("./lib/enrollAdmin");
  logger.info('POST /admin');
  const ret = await enroll();
  if(ret.status === 400) res.status(400).send("Admin is already enrolled!");
  else res.status(201).send("Successfully Register Admin!");
});

router.post('/domain', async function(req, res) { 
  const register = require("./lib/registerDomainAndUser");
  logger.info('POST /admin/domain');
  const ret = await register(req.body);
  if(!ret.hasOwnProperty('status'))  res.status(201).send(`Successfully Register Domain and User!\nUUID: ${uuidWithApiKey.uuid}, APIKey: ${uuidWithApiKey.apiKey}`);
  else if(ret.status === 400) res.status(400).send('The user is already registered');
  else res.status(401).send('Register admin first');
 
});

router.post('/ddo', async function(req, res) {
  const invoke = require("./lib/invoke");
  logger.info('POST /admin/ddo');
  const ret = await invoke("registerDDo", req.body);
  if(ret.status === 401) res.status(401).send('Register admin first');
  else res.status(201).send("Successfully invoke registerDDo transaction");
})

router.put('/ddo', async function(req, res) {
  const invoke = require("./lib/invoke");
  logger.info('PUT /admin/ddo');
  invoke(req.params.fcn, req.body);
  /*
  TODO
  Make Update Chaincode
  */
  res.status(201).send("Successfully invoke transaction");
})

router.delete('/ddo', async function(req, res) {
  const invoke = require("./lib/invoke");
  logger.info('DELETE /admin/ddo');
  const ret = await invoke("removeDDo", req.query.args);
  if(ret.status === 401) res.status(401).send('Register admin first');
  else res.status(204).send("Successfully invoke removeDDo transaction");
})

router.post('/vc', async function(req, res) {
  const invoke = require("./lib/invoke");
  logger.info('POST /admin/vc');
  const ret = await invoke("registerVC", req.body);
  if(ret.status === 401) res.status(401).send('Register admin first');
  else res.status(201).send("Successfully invoke registerVC transaction");
})
  
module.exports = router