import type { NextFunction, Request, Response } from 'express';

import { environment } from '@common/constants/env';
import HttpStatusCode from '@common/constants/HttpStatusCodes';
import logger from '@common/constants/logger';


function handleErrors(err: Error, _r: Request, res: Response, _: NextFunction) {
    if (environment.NODE_ENV !== 'test') {
        logger.error("Zerbait oso txarra gertatu da", {
            error: err.message,
            stack: err.stack
        });
    }
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: err.message });
}

export default handleErrors;
