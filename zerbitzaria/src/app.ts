import type { OptionsJson, OptionsUrlencoded } from 'body-parser';

import { environment } from '@common/constants/env';
import Paths from '@common/constants/Paths';
import apiRouter from '@routers/api';
import handleErrors from '@routers/middleware/handleErrors';
import logRequests from '@routers/middleware/logRequests';
import { generalLimiter } from '@routers/middleware/rateLimiters';
import { handleConnectionClose, handleRequestReceiving } from '@routers/middleware/shutdown';
import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express from 'express';
import helmet, { type HelmetOptions } from 'helmet';

const app = express();

const isDevelopment = environment.NODE_ENV === "development";

/******************************************************************************
 * Track shutdown for active requests
******************************************************************************/

app.use(handleRequestReceiving);
app.use(handleConnectionClose);

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
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        if (environment.NODE_ENV === 'development') {
            const isLocalNetwork = new RegExp(`^http://192\\.168\\.\\d+\\.\\d+:${environment.CLIENT_PORT}$`)
            if (isLocalNetwork) {
                return callback(null, true);
            }
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
 * Rate limiting
******************************************************************************/

app.use(generalLimiter);

/******************************************************************************
 * Route logging
******************************************************************************/

if (isDevelopment) {
    app.use(logRequests);
}

/******************************************************************************
 * Application routers
******************************************************************************/

app.use(Paths.Base, apiRouter);

/******************************************************************************
 * Error handling
******************************************************************************/

app.use(handleErrors);

export default app;
