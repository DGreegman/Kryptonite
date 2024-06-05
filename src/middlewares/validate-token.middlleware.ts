import CustomError from '../error/custom-error';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import IUser from '../interfaces/user.interface';
import user_service from '../services/user.service';
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
        const secret_key = process.env.SECRET_KEY;
        if (!secret_key) {
            return next(new CustomError('Internal Server Error, Secret Key not set.', 500));
        }
        const decoded = jwt.verify(token, secret_key) as DecodedToken;
        console.log(decoded.email, `coming from middleware`);
        const user = await user_service.find_user(decoded.email);

        // console.log(user);
        if (!user) {
            return next(new CustomError('Sorry, but it seems like the user with this token does not exist', 401));
        }
        res.locals = user.email;
        res.locals.id = user.id;
        // console.log(res.locals);
        next();
    } catch (error: any | unknown) {
        console.log(error.message, error.name);
        if (error.name === 'TokenExpiredError') {
            return next(new CustomError('Sorry, but your token has expired, Kindly login and try again', 403));
        }
        next(new CustomError('Invalid Token', 401));
    }
};

export default validate_token;
