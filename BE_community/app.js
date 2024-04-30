import express from 'express';
import cors from 'cors';
import postRouter from './routes/postRoute.js';
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin : 'http://localhost:3000',
    credentials: true, 
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/posts', postRouter);
app.use('/user', userRouter);

export default app;