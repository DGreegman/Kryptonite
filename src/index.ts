import express, { Application, Request, Response, NextFunction } from 'express';
import { configDotenv } from 'dotenv';
import connect_db from './config/config';
import user_route from './routes/user.route';
import user_image from './routes/user-image.route';
import errorHandler from './middlewares/error-handler.middleware';
import CustomError from './error/custom-error';

configDotenv();
connect_db();

const app: Application = express();

const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/api/v1/user', user_route);
app.use('/api/v1/user-image', user_image);

// DEFAULT ROUTE CALLED WHEN A ROUTE USED BY THE USER DOESN'T EXIST
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError(`Oops...., It seems like the Route ${req.originalUrl} You are looking for does not Exist`, 404);
    next(error);
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
