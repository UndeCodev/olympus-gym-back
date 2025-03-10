import express, { Response, Request } from 'express';
import morgan from 'morgan';

import { PORT } from './config/env';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middlewares/cors';

import router from './routes';
import { errorHandlerMiddleware } from './middlewares/errorHandler';

const app = express();

app.disable('x-powered-by');

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());
app.use(morgan('dev'));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World');
});

// Routes
app.use('/api', router);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
