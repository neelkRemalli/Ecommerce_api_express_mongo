import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload'
import rateLimiter from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import cors from 'cors'


import connectDb from './config/db.js';
import notFoundMiddleware from './middleware/notFound.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import authRouter from './route/authRoutes.js'
import userRouter from './route/userRoutes.js'
import productRouter from './route/productRoutes.js'
import reviewRouter from './route/reviewRoutes.js'
import orderRouter from './route/orderRoutes.js'



////// dotenv //////
dotenv.config();

///// Connect Db //////
connectDb();


const app = express();
app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
}))
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
if(process.env.NODE_ENv === `development`){
  app.use(morgan('dev'))
}
app.use(cors())
///// Middleware //////
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())




app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/order', orderRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
