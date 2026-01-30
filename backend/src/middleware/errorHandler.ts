import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    code?: number;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;

    // Log error for internal tracking (exclude in very sensitive production logs if needed)
    console.error(`[Error] ${statusCode} - ${err.message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        status: 'error',
        message: statusCode === 500 && process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message,
        // Include stack trace only in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
