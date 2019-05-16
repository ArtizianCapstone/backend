const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const artisanRoutes = require('./api/routes/artisans');
const listingRoutes = require('./api/routes/listings');
const meetingRoutes = require('./api/routes/meetings');
const orderRoutes = require('./api/routes/orders');

mongoose.Promise = global.Promise;

if (!window.connected)
{
    mongoose.connect(
        'mongodb://jkurtz678:'+
        process.env.MONGO_ATLAS_PW + 
        '@artizian-shard-00-00-kdklx.mongodb.net:27017,artizian-shard-00-01-kdklx.mongodb.net:27017,artizian-shard-00-02-kdklx.mongodb.net:27017/test?ssl=true&replicaSet=Artizian-shard-0&authSource=admin&retryWrites=true',
        {
            useNewUrlParser: true
        })
        .then(() => window.connected = true);
}


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if( req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/users', userRoutes);
app.use('/artisans', artisanRoutes);
app.use('/listings', listingRoutes);
app.use('/meetings', meetingRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    error.status = 404;
    next(error);
});

app.use(( error, req, res, next) => { 
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
