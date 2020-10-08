const express = require("express");
const router = express.Router();
const network = require("fabric-network")

// Routes
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 관리자 관련 API
 * definitions:
 *   DDo:
 *     type: object
 *     required:
 *       - key
 *       - pubkey     
 *     properties:
 *       key:
 *         type: string
 *         description: Key for Identifier
 *       pubkey:
 *         type: string
 *         description: 공개키
 *       pubkeyType:
 *         type: string
 *         description: 공개키 타입
 *       context:
 *         type: string
 *         description: Context Spec
 *       sType:
 *         type: string
 *         description: Service Type for Issuer
 *       sEndpoint:
 *         type: string
 *         description: Service Endpoint for Issuer
 *   VC:
 *     type: object
 *     required:
 *       - key
 *       - conDID
 *       - claimDef
 *       - sig
 *     properties:
 *       key:
 *         type: string
 *         description: Key for stateDB
 *       conDID:
 *         type: string
 *         description: Controller DID
 *       claimDef:
 *         type: string
 *         description: Definition of Claim
 *       sig:
 *         type: string
 *         description: Signature
 *       sigType:
 *         type: string
 *         description: Signature Type(Default - byoblHashSig)
 *       expired:
 *         type: date
 *         description: The date when is expired
 *       
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
 *          $ref: '#/defintions/DDo'
 *          example: {
 *            key: "sample",
 *            pubkey: "ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAQEAikeNB9Q8cKN2fYFSn5Ty/GdpT6P4B5YP7E4uZybPojua3A7Vy24oeBXxRlAwU1b6hnsIvjC+JGuwsZqFActCNNaTt3T4SadOfcxZZSdlsqq+He/lOQK0qHxCL6A7MLT9/3nHCL6/LJ7RGQMGOEsaT8GHxWvvZfjlduyjTlli1u8ZXHu8RbcU7LnNNutbgqFfRpdyMJdbJwRL2sqSucj2M6ZOpvRH5Y5ISOa/+Is3wXIAkK9qFfdVvUU0n48KVGSNUcfT6nKgLfuMC7fyhH13iWqqYbL2loc+/Hmst1jlrryElTXwCBW7atMhirbgj4Q4PdZHUBrII9kHNilhYDIXNw== rsa-key-20201005",
 *            pubkeyType: "",
 *            context: "",
 *            sType: "",
 *            sEndpoint: ""
 *          }
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
 *          $ref : '#/definitions/VC'
 *          example: {
 *            key: "sampleVC",
 *            conDID: "did:bob:controller",
 *            claimDef: "UnivCert",
 *            sig: "sssssssiiiiiiiiiiiggggggg",
 *            sigType: "",
 *            expired: "2022-10-10T17:00:00Z"
 *          }        
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