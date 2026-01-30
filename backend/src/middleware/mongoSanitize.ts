import { Request, Response, NextFunction } from 'express';

const hasDot = (obj: any): boolean => {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key.includes('.')) return true;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (hasDot(obj[key])) return true;
            }
        }
    }
    return false;
};

const sanitize = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return;

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key.startsWith('$')) {
                delete obj[key];
                continue;
            }

            // Recursively sanitize
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    }
};

export const mongoSanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
};
