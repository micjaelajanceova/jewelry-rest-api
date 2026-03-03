import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import {testConnection} from './repository/database';

import routes from './routes';
import { setupSwagger } from './util/documentation';
import cors from 'cors';


dotenvFlow.config();

// create express app
const app: Application = express();


function setupCors() {
    app.use(cors({
        origin: '*', // Allow all origins 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-Width', 'Accept'], // Allowed headers
        credentials: true, // Allow credentials
    }));
}


export function startServer() {

    setupCors();

    app.use(express.json());

    app.use('/api', routes);


    setupSwagger(app);


    testConnection();

    //test db connection
    const PORT: number = parseInt (process.env.PORT as string) || 4000;
    app.listen(PORT, function () {
        console.log("Server is running on port" + PORT);
    });
    }

