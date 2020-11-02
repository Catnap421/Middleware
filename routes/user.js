const express = require("express");
const router = express.Router();
const network = require("fabric-network")

// Routes
/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 관련 API
 */

/**
 * @swagger
 * /user/ddo/{did}:
 *  get:
 *    description: Query registered DDo
 *    tags: [User]
 *    parameters:
 *      - name: did
 *        in: query
 *        description: The Document of DID
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    security:
 *      - apiKey:[]
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/ddo/:did', async function(req, res) { 
  const query = require("./lib/query");
  query("queryDDo", req.query.did);
  res.status(200).send("Successfully query transaction");
});

/**
 * @swagger
 * /user/vc/{did}:
 *  get:
 *    description: Query registered VC
 *    tags: [User]
 *    parameters:
 *      - name: did
 *        in: query
 *        description: The Document of VC
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    security:
 *      - apiKey:[]
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/vc/:did', async function(req, res) { 
  const query = require("./lib/query");
  query("queryVC", req.query.did);
  res.status(200).send("Successfully query transaction");
});


/**
 * @swagger
 * /user/apikey:
 *  post:
 *    description: Recover APIKey
 *    tags: [User]
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to recover apikey
 *        schema:
 *          type: object
 *          required:
 *            - domain
 *            - user
 *            - uuid
 *          properties:
 *            domain:
 *              type: string
 *            user:
 *              type: string
 *            uuid:
 *              type: string
 *        example: {
 *          domain:"domain.com",
 *          user: "user",
 *          uuid: "3f4ed5d9-74f8-4555-a0d5-b16cdff9e8a3"
 *        }    
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.post('/apikey', async function(req,res) {
  const recoverApiKey = require("./lib/recoverApiKey");
  const apiKey = await recoverApiKey(req.body);
  res.status(200).send(`Successfully Recover APIKey.\nThe APIKey: ${apiKey}`);
})

  
module.exports = router