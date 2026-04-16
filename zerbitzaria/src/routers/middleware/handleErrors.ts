import type { NextFunction, Request, Response } from 'express';

import { environment } from '@common/constants/env';
import HttpStatusCode from '@common/constants/HttpStatusCodes';
import logger from '@common/constants/logger';
import { RequestError } from '@common/utils/errors';
import { formatError } from '@common/utils/responses';


function handleErrors(err: Error, _r: Request, res: Response, _: NextFunction) {
    if (err instanceof RequestError) {
        logger.info(`${err.status} ${err.message}`);
        res.status(err.status).json(formatError(err.message));
        return;
    }

    if (environment.NODE_ENV !== 'test') {
        logger.error("Zerbait oso txarra gertatu da", {
            error: err.message,
            stack: err.stack
        });
    }
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(formatError(err.message));
}

export default handleErrors;
