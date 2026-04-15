import type { NextFunction, Request, Response } from 'express';

import HttpStatusCode from '@common/constants/HttpStatusCodes';
import logger from '@common/constants/logger';

const DONT_LOG_PATHS = ['/health'];

function logRequests(req: Request, res: Response, next: NextFunction): void {
    if (DONT_LOG_PATHS.includes(req.path)) {
        return next();
    }

    const start = Date.now();
    res.on('finish', () => {
        const end = Date.now();
        const time = Math.round(end - start);
        const statusCode = res.statusCode;

        const data = {
            contentLength: res.get('content-length') || '-',
            httpVersion: req.httpVersion,
            method: req.method,
            referrer: req.get('referrer') || '-',
            remoteAddr: req.ip,
            status: statusCode,
            time: `${time}ms`,
            url: req.originalUrl,
            userAgent: req.get('user-agent') || '-'
        };

        if (statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR) {
            logger.error('', data);
        }
        else if (statusCode >= HttpStatusCode.BAD_REQUEST) {
            logger.warn('', data);
        }
        else {
            logger.http('', data);
        }
    });

    next();
}

export default logRequests;
