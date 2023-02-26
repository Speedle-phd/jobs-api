require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')
const auth = require('./middleware/authentication')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const swagger = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocument = yaml.load("./swagger.yaml")
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.set('trust proxy', 1)
app.use(rateLimit({windowMs: 10 * 60 * 1000, max: 100}))
app.use(helmet())
app.use(cors())
app.use(xss())
// routes

app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">API DOCS</a>');
});
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/job', auth, jobRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
