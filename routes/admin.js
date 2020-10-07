const express = require("express");
const router = express.Router();
const network = require("fabric-network")

// Routes
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 관리자 관련 API
 */


/**
 * @swagger
 * /admin:
 *  post:
 *    description: Register Admin
 *    tags: [Admin]
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.post('/', async function(req, res) {  
  const enroll = require("./lib/enrollAdmin");
  enroll();
  res.status(200).send("Successfully query transaction");
});

/**
 * @swagger
 * /admin/{user}:
 *  post:
 *    description: Register User
 *    tags: [Admin]
 *    parameters:
 *      - name: user
 *        in: body
 *        description: The user(verifier) name
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    security:
 *      - apiKey: []
 *    responses:
 *      '200':
 *        description: A successful response
 */
 


router.post('/:user', async function(req, res) { 
  const register = require("./lib/registerUser");
  register(req.body.user);
  res.status(200).send("Successfully query transaction");
});


/**
 * @swagger
 * /admin/ddo:
 *  post:
 *    description: Use to invoke function
 *    tags: [Admin]
 *    parameters:
 *      - name: args
 *        in: body
 *        description: Arguments of smart contract
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/ddo', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke(req.params.fcn, req.params.args);
  res.status(200).send("Successfully invoke transaction");
})


/**
 * @swagger
 * /admin/ddo:
 *  put:
 *    description: Use to invoke function
 *    tags: [Admin]
 *    parameters:
 *      - name: args
 *        in: body
 *        description: Arguments of smart contract
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/ddo', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke(req.params.fcn, req.body);
  res.status(200).send("Successfully invoke transaction");
})


/**
 * @swagger
 * /admin/ddo:
 *  delete:
 *    description: Use to invoke function
 *    tags: [Admin]
 *    parameters:
 *      - name: args
 *        in: query
 *        description: Arguments of smart contract
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.delete('/ddo', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke(req.params.fcn, req.params.args);
  res.status(200).send("Successfully invoke transaction");
})

/**
 * @swagger
 * /admin/vc:
 *  post:
 *    description: Use to invoke function
 *    tags: [Admin]
 *    parameters:
 *      - name: args
 *        in: body
 *        description: Arguments of smart contract
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/vc', async function(req, res) {
  const invoke = require("./lib/invoke");
  invoke(req.params.fcn, req.params.args);
  res.status(200).send("Successfully invoke transaction");
})
  
module.exports = router