const express = require("express");
const router = express.Router();
const network = require("fabric-network")

router.get('/ddo/:did', async function(req, res) { 
  const query = require("./lib/query");
  const path = req.path.split('/')[2];
  query("queryDDo", req.query.user, req.query.domain, path, req.headers.apikey);
  res.status(200).send("Successfully query transaction");
});

router.get('/vc/:did', async function(req, res) { 
  const query = require("./lib/query");
  const path = req.path.split('/')[2];
  query("queryVC", req.query.user, req.query.domain, path, req.headers.apikey);
  res.status(200).send("Successfully query transaction");
});

router.post('/apikey', async function(req,res) {
  const recoverApiKey = require("./lib/recoverApiKey");
  const apiKey = await recoverApiKey(req.body);
  res.status(200).send(`Successfully Recover APIKey.\nThe APIKey: ${apiKey}`);
})

  
module.exports = router