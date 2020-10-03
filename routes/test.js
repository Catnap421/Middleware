const express = require("express");
const router = express.Router();
const hello = require("./lib/test")


// Routes
/**
 * @swagger
 * /test:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/test", (req, res) => {
    res.status(200).send("Customer results");
    hello();
  });
  
  /**
   * @swagger
   * /test:
   *    put:
   *      description: Use to return all customers
   *      parameters:
   *        - name: customer
   *          in: query
   *          description: Name of our customer
   *          required: false
   *          schema:
   *            type: string
   *            format: string
   *      responses:
   *        '201':
   *          description: Successfully created user
   */
  router.put("/test", (req, res) => {
    res.status(200).send("Successfully updated customer");
  });
  
  module.exports = router