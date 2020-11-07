const express = require("express");
const router = express.Router();
const network = require("fabric-network")

router.get('/', function(req, res){
  console.log("START /");
  res.render('index.html');
})

module.exports = router;