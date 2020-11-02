const express = require("express");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const chaincodeRouter = require("./routes/chaincode");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const port = process.env.PORT || 3000;


// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Middleware API",
      description: "Middleware API Information",
      contact: {
        name: "Amazing Developer"
      },
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'X-API-KEY',
          in: 'header'
        }
      },
      security : [
        { apiKey: []}
      ],
      servers: ["http://localhost:3000"]
    }
  },
  // ['.routes/*.js']
  apis: ["./routes/*.js"]
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json())

app.use('/chaincode', chaincodeRouter );
app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});