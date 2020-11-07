const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./routes/swagger/swagger.yaml');

const chaincodeRouter = require("./routes/chaincode");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const RateLimit = require('express-rate-limit');

const port = process.env.PORT || 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set('views', __dirname +'/views');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const index = require('./routes/index');
app.use('/',index);


const limiter = RateLimit({
  windows: 10 * 60 * 1000, // 10 minutes
  max: 100
})

app.use('/user', limiter);
app.use(express.json())

app.use('/chaincode', chaincodeRouter );
app.use('/admin', adminRouter);
app.use('/user', userRouter);



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});