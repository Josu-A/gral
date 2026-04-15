import type { OptionsJson, OptionsUrlencoded } from 'body-parser';

import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express from 'express';
import helmet, { type HelmetOptions } from 'helmet';

import { environment } from './common/constants/env';
import handleErrors from './routers/middleware/handleErrors';
import logRequests from './routers/middleware/logRequests';

const app = express();

const isDevelopment = environment.NODE_ENV === "development";

/******************************************************************************
 * Setup Helmet
******************************************************************************/

const helmetOptions: HelmetOptions = {
    contentSecurityPolicy: {
        directives: {
            "upgrade-insecure-requests": isDevelopment ? null : []
        }
    }
};

app.use(helmet(helmetOptions));

/******************************************************************************
 * Setup CORS
******************************************************************************/

const allowedOrigins = [
    'https://gral.aguijos.eus',
    environment.NODE_ENV === 'development' ? environment.CLIENT_URL : null
].filter(Boolean);

const corsOptions: CorsOptions = {
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
    methods: ['GET', 'POST'],
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS: ${origin} jatorriak ez du baimenik.`));
    }
}

app.use(cors(corsOptions));

/******************************************************************************
 * Setup parsing middlewares
******************************************************************************/

// Parse json body data into req.body

const jsonOptions: OptionsJson = {
    limit: '10kb',
};

app.use(express.json(jsonOptions));

// Parse form body data into req.body

const urlencodedOptions: OptionsUrlencoded = {
    extended: true,
}

app.use(express.urlencoded(urlencodedOptions));

// Parse cookies into req.cookies

app.use(cookieParser());

/******************************************************************************
 * Route logging
******************************************************************************/

if (isDevelopment) {
    app.use(logRequests);
}

/******************************************************************************
 * Error handling
******************************************************************************/

app.use(handleErrors);

export default app;
