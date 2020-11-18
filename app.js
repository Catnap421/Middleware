process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
if(process.env.NODE_ENV == 'development') console.log('The DEV_ENV is development');
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./routes/swagger/swagger.yaml');
const cors = require('cors');

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const RateLimit = require('express-rate-limit');

const port = process.env.PORT || 8080;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set('views', __dirname +'/views');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
//app.engine('html', require('ejs').renderFile);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());

const index = require('./routes/index');
app.use('/',index);


const limiter = RateLimit({
  windows: 10 * 60 * 1000, // 10 minutes
  max: 100
})

app.use('/user', limiter);
app.use(express.json())

app.use('/admin', adminRouter);
app.use('/user', userRouter);



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});