const express = require("express");
const router = express.Router();
const network = require("fabric-network")

// Routes
/**
 * @swagger
 * /chaincode/query/{fcn}:
 *  get:
 *    description: Use to return all customers
 *    parameters:
 *      - name: fcn
 *        in: path
 *        description: function name of smart contract
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.get('/query/:fcn', async function(req, res) {
	// logger.debug('==================== QUERY BY CHAINCODE ==================');
	// logger.debug('username :' + req.username);
  // logger.debug('orgname:' + req.orgname);
  const query = require("./lib/query");
  query(req.params.fcn);
  res.status(200).send("Successfully query transaction");
});

/**
 * @swagger
 * /chaincode/invoke/{fcn}/{args}:
 *  get:
 *    description: Use to invoke function
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/invoke/:fcn/:args', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke(req.params.fcn, req.params.args);
})

  
/**
 * @swagger
 * /chaincode:
 *  get:
 *    description: Show all chaincode list
 *    responses:
 *      '200':
 *        description: Successfully read chaincode list
 */
  router.get("/", (req, res) => {
    res.status(200).send("1. queryCar 2. queryAllCars");
  });
  
  module.exports = router