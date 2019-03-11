import express      from 'express';
import session      from 'express-session';
import Redis        from 'ioredis';
import RedisConnect from 'connect-redis';
import mongoose     from 'mongoose';
import bodyParser   from 'body-parser';
import passport     from 'passport';
import path         from 'path'
import cors         from 'cors';

import userRouter from '../router/userRouter';
import rootRouter from '../router/rootRouter';

require('../services/passport');

const app = express();
/////////////////START APP MIDDLEWARE///////////////////////////
require('dotenv').config({
    path:path.resolve(process.cwd(),'config/keys/.env')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

var corsOptionsDelegate = function (req, callback) {
    var fullUrl = req.protocol + '://' + req.get('host');
    const whiteList = ['http://localhost:5000'];
    let corsOptions;
    if(whiteList.indexOf(fullUrl) !== -1){
        corsOptions={origin:true}
    }else{
        corsOptions={origin:false}
    }
    callback(null,corsOptions)
}
// const corsOptions = {
//     origin:(origin,cb)=>{
//         ( whiteList.indexOf(origin) !== -1 )?
//             cb(null,true)
//            :cb(new Error('Not allowed by CORS'));
//     }
// }

app.use(cors(corsOptionsDelegate))

/////////////////END APP MIDDLEWARE///////////////////////////

/////////////////START DATABASE CONFIG///////////////////////////
mongoose.connect(process.env.DB_ADDRESS,{ useNewUrlParser: true });
mongoose.connection.on('connected'   ,()=>{console.log("connection established successfully")});
mongoose.connection.on('error'       ,(err)=>{console.log('connection to mongo failed ' + err)});
mongoose.connection.on('disconnected',()=>{console.log('mongo db connection closed')})
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
/////////////////END DATABASE CONFIG///////////////////////////
const redis = new Redis();
const RedisStore = RedisConnect(session);
app.use(session({
    secret:process.env.SESSION_SECRET_KEY,
    saveUninitialized:false,
    store:new RedisStore({
        client:redis,
        ttl: 2 * 24 * 60 * 60,
        autoReconnect: true
    }),
    cookie: { secure: true },
    resave:false
}))

app.use(passport.initialize())
app.use(passport.session())
////////////////START ROUTER CONFIG///////////////////////////
app.use('/user/api',userRouter)
app.use('/',rootRouter)
/////////////////END ROUTER CONFIG///////////////////////////

export default app;