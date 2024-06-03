import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode: number;
    status: string;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    // const { statusCode, status, message } = err;
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';
    res.status(err.statusCode).json({
        data: {
            status: err.status,
            message: err.message
        }
    });
};

export default errorHandler;
