import express      from 'express';
import session      from 'express-session';
import Redis        from 'ioredis';
import RedisConnect from 'connect-redis';
import mongoose     from 'mongoose';
import bodyParser   from 'body-parser';
import passport     from 'passport';
import path         from 'path';
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser'
import cors         from 'cors';

import userRouter from '../routes/userRouter';
import rootRouter from '../routes/rootRouter';

require('../services/passport');

/////////////////START DATABASE CONFIG///////////////////////////
mongoose.connect(process.env.DB_ADDRESS,{ useNewUrlParser: true });
mongoose.connection.on('connected'   ,()=>{console.log("connection established successfully")});
mongoose.connection.on('error'       ,(err)=>{console.log('connection to mongo failed ' + err)});
mongoose.connection.on('disconnected',()=>{console.log('mongo db connection closed')})
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
/////////////////END DATABASE CONFIG///////////////////////////

const app = express();
/////////////////START APP MIDDLEWARE///////////////////////////
require('dotenv').config({
    path:path.resolve(process.cwd(),'config/keys/.env')
})
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

const whiteList = [process.env.CORS_APPROVED_ADDRESS];
const corsOptionsDelegate = {
    origin:(origin,cb)=>{
        ( whiteList.indexOf(origin) !== -1 || !origin)?
            cb(null,true)
           :cb(new Error('Not allowed by CORS'));
    }
}

app.use(cors(corsOptionsDelegate))

/////////////////END APP MIDDLEWARE///////////////////////////

const redis = new Redis();
const RedisStore = RedisConnect(session);
// app.use(session({
//     secret:process.env.SESSION_SECRET_KEY,
//     saveUninitialized:false,
//     store:new RedisStore({
//         client:redis,
//         ttl: 86400000,
//         autoReconnect: true
//     }),
//     cookie: { secure: false,maxAge:86400000 },
//     resave:false
// }))
app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [
          'asfdsfdsvCSDfczxsad'
      ]
    })
  );
app.use(passport.initialize())
app.use(passport.session())
////////////////START ROUTER CONFIG///////////////////////////
app.use('/',userRouter)
app.use('/',rootRouter)
/////////////////END ROUTER CONFIG///////////////////////////

export default app;