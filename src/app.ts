import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';

import routes from './routes';

//dotenvFlow.config();

// create express app
const app: Application = express();

app.use('/api', routes);

export function startServer() {
    app.listen(400, function () {
        console.log("Server is running on port" + 4000);
    });
    }

