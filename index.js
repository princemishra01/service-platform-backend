import express from 'express';
import userRouter from './routes/userRouter.js';
import requestRouter from './routes/requestRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
 
const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('test route');
});

app.use('/user', userRouter);

app.use('/request', requestRouter);

app.listen(3000, () => {    
    console.log('Server is running on port 3000');
});