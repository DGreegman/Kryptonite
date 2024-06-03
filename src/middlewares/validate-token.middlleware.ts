import CustomError from '../error/custom-error';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken {
    id: string;
    email: string;
}

const validate_token = async (req: Request, res: Response, next: NextFunction) => {
    const test_token = req.headers.authorization || req.headers.Authorization;
    let token;

    try {
        if (typeof test_token === 'string' && test_token.startsWith('Bearer')) {
            token = test_token.split(' ')[1];
        }
        if (!token) {
            return next(new CustomError('Sorry, but it seems like you are not Logged in, Kindly login and try again', 401));
        }
        const secret_key = process.env.JWT_SECRET;
        if (!secret_key) {
            return next(new CustomError('Internal Server Error, Secret Key not set.', 500));
        }
        const decoded = jwt.verify(token, secret_key) as DecodedToken;
        const user = await User.findById(decoded.email);
        if (!user) {
            return next(new CustomError('Sorry, but it seems like the user with this token does not exist', 401));
        }
        res.locals.user = user.email;
        next();
    } catch (error) {
        next(new CustomError('Invalid Token', 401));
    }
};

export default validate_token;
