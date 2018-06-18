// require all dependencies
import dotenv from 'dotenv';
import logger from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/users';
import centerRoutes from './routes/centers';
import eventRoutes from './routes/events';


dotenv.config();

// set up the express app
const app = express();


// log requests to console
app.use(logger('dev'));


// Parse incomming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


userRoutes(app);
centerRoutes(app);
eventRoutes(app);


// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({ message: 'Welcome to the beginning of nothingness.' }));


module.exports = app;
