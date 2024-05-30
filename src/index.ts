import express, { Application, Request, Response } from 'express';
import { configDotenv } from 'dotenv';
import connect_db from './config/config';
import user_route from './routes/user.route';

configDotenv();
connect_db();

const app: Application = express();

const port = process.env.PORT || 8080;

app.use(express.json());
const add = (a: number, b: number) => a + b;
app.get('/', (req: Request, res: Response) => {
    console.log(add(5, 6));

    res.send('Hello World' + add(30, 49));
});

app.use('/api/v1/user', user_route);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
