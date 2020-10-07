const express = require("express");
const router = express.Router();
const network = require("fabric-network")

// Routes
/**
 * @swagger
 * /chaincode/query/{fcn}/{args}:
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
 *      - name: args
 *        in: path
 *        description: Arguments of smart contract
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.get('/query/:fcn/:args', async function(req, res) { // 차후에 query를 제거하고 get으로 판별
	// logger.debug('==================== QUERY BY CHAINCODE ==================');
	// logger.debug('username :' + req.username);
  // logger.debug('orgname:' + req.orgname);
  const query = require("./lib/query");
  query(req.params.fcn, req.params.args);
  res.status(200).send("Successfully query transaction");
});

/**
 * @swagger
 * /chaincode/invoke/{fcn}/{args}:
 *  get:
 *    description: Use to invoke function
 *    parameters:
 *      - name: fcn
 *        in: path
 *        description: Arguments of smart contract
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: args
 *        in: path
 *        description: Arguments of smart contract
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/invoke/:fcn/:args', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke(req.params.fcn, req.params.args);
  res.status(200).send("Successfully invoke transaction");
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

/**
 * @swagger
 * /chaincode/init:
 *  get:
 *    description: Show all chaincode list
 *    responses:
 *      '200':
 *        description: Successfully read chaincode list
 */
// router.get("/init", (req, res) => {
//   const query = require("./lib/init");
//   init(req.params.fcn, req.params.args);
//   res.status(200).send("Successfully query transaction");
// });
  
  module.exports = router