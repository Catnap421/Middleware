const express = require("express");
const router = express.Router();
// Routes
/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/customers", (req, res) => {
    res.status(200).send("Customer results");
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
  router.put("/customer", (req, res) => {
    res.status(200).send("Successfully updated customer");
  });
  
  module.exports = router