const express = require("express");
const router = express.Router();
const network = require("fabric-network")

// Routes
/**
 * @swagger
 * /chaincode:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */



router.get('/query', async function(req, res) {
	// logger.debug('==================== QUERY BY CHAINCODE ==================');
	// logger.debug('username :' + req.username);
  // logger.debug('orgname:' + req.orgname);
  const query = require("./lib/query");
	query();
});

router.get('/invoke', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke();
})

  /**
 * @swagger
 * /chaincode:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/chaincode", (req, res) => {
    
  });
  
  /**
   * @swagger
   * /customers:
   *    put:
   *      description: Use to return all customers
   *    parameters:
   *      - name: customer
   *        in: query
   *        description: Name of our customer
   *        required: false
   *        schema:
   *          type: string
   *          format: string
   *    responses:
   *      '201':
   *        description: Successfully created user
   */
  router.put("/chaincode", (req, res) => {
    res.status(200).send("Successfully updated customer");
  });
  
  module.exports = router