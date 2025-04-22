const express = require('express');
const mongoose= require('mongoose');
const expressLayout = require('express-ejs-layouts');
const router = require('./server/router/main')
const router2 =require('./server/router/admin')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo');
const session = require('express-session');
const methodOverride = require('method-override');

require('dotenv').config();

const app = express();
app.use(express.json())


//Templating  Engine 
app.use(expressLayout);
app.set('layout','./layout/main');
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 1001
app.use(express.static('public'));



app.get('/test',(req, res)=>{
    res.send('Hello Front from the back')
})

mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection;

db.on('error' , ()=>{
    console.log( 'Connection error' )
})

db.once('open', ()=>{
    console.log('Connected to DB! ' )
})


app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: {maxAge: new Date(Date.now()+ (3600000) ) }
}))
app.use(methodOverride('_method'));


app.use(router);
app.use(router2);
app.listen(PORT,()=>{
    console.log(`the server listion on Port ${PORT}`);
    
})