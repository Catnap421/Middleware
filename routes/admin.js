const express = require("express");
const router = express.Router();
const network = require("fabric-network")


router.post('/', async function(req, res) {  
  const enroll = require("./lib/enrollAdmin");
  enroll();
  res.status(200).send("Successfully query transaction");
});

router.post('/domain', async function(req, res) { 
  const register = require("./lib/registerDomainAndUser");
  const uuidWithApiKey = await register(req.body);
  res.status(200).send(`Successfully Register Domain and User!\nUUID: ${uuidWithApiKey.uuid}, APIKey: ${uuidWithApiKey.apiKey}`);
});

router.post('/ddo', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke("registerDDo", req.body);
  res.status(200).send("Successfully invoke registerDDo transaction");
})

router.put('/ddo', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke(req.params.fcn, req.body);
  res.status(200).send("Successfully invoke transaction");
})

router.delete('/ddo', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke("removeDDo", req.query.args);
  res.status(200).send("Successfully invoke transaction");
})

router.post('/vc', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke("registerVC", req.body);
  res.status(200).send("Successfully invoke registerVC transaction");
})
  
module.exports = router