import express from 'express';
import { configDotenv } from 'dotenv';
import configViewEngine from './config/view.engine.js';
import parseJson from './middleware/parse.json.js';
import webRoutes from './routes/web.js';
import connectDB from './config/db.connect.js';
import configStaticFolders from './config/static.folder.js';
const app = express();

// Load environment variables from.env file
configDotenv();
// console.log(process.env);

const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME || 'localhost';

// connect to database
connectDB();

// view engine setup
configViewEngine(app);

// static file setup
configStaticFolders(app);
// middleware setup
parseJson(app);

// routes
webRoutes(app);


app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
})