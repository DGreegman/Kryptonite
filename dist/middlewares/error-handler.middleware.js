"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
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
exports.default = errorHandler;
