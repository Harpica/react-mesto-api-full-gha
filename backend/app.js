import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from './routes/index.js';
import {
  CLIENT_URL,
  DATABASE_NAME,
  DATABASE_PORT,
  PORT,
} from './utils/constants.js';

// Usage of .env file in the root dir
dotenv.config();

const app = express();

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    optionSuccessStatus: 200,
  }),
);
app.use(cookieParser());

// To get full req.body in JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply routers
app.use('/', routes);

// Connect to db and after successfull connection - start listening to the PORT
mongoose
  .connect(`mongodb://localhost:${DATABASE_PORT}/${DATABASE_NAME}`)
  .then(() => app.listen(PORT, () => {
    console.log('Listening to', PORT);
  }))
  .catch((err) => {
    console.error('message:', err.message);
  });
