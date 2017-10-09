/*
Server.js File.
 */
'use strict';

var express = require('express');
var webpack = require('webpack');
var app = express();
var path = require('path');
var Routes = require('./routes/serverRoutes');

// var webpackDevMiddleware = require('webpack-dev-middleware');
// var webpackConfig = require('./webpack.config.js');
// var cookieParser = require('cookie-parser');


var bodyParser = require('body-parser');


app.use(express.static(__dirname + '/public'));
// app.use(cookieParser());

var redis = require('redis');

//=============Setting the REDIS client to local or production based on environment
if(process.env.NODE_ENV !== 'production'){
    // DEVELOPMENT
    var client = redis.createClient();

} else {
    //PRODUCTION
    var client = redis.createClient(process.env.REDIS_URL);
}


//=============


client.on('connect', function() {
    console.log('Redis connected');
});



var session = require('express-session');
var RedisStore = require('connect-redis')(session);


//PRODUCTION
app.use(session({
    store: new RedisStore({
        client: client,

    }),
    saveUninitialized: true,
    resave:true,
    secret: 'keyboard cat'
}));

// app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// var apiServerHost = 'https://developers.zomato.com';
// var allowedHeaders = [
//     'X-Zomato-API-Key',
//     'Access-Control-Allow-Headers',
//     'content-type'
// ];
//
//
// app.use('/', function(req, res) {
//     res.append('Access-Control-Allow-Origin', '*');
//     res.append('Access-Control-Allow-Headers', allowedHeaders.join(', '));
//     if (req.method === 'OPTIONS') {
//         res.status(200).send();
//     }
//     else {
//         var url = apiServerHost + req.url;
//         req.pipe(request(url)).pipe(res);
//     }
// });

//Send all server routes to the routes file
app.use('/', Routes);


// var compiler = webpack(webpackConfig);
//Need to figure out how this can compile the webpack every time
// ==== First Version =======
// app.use(webpackDevMiddleware(compiler, {
//     hot: true,
//     lazy: false,
//     filename: 'bundle.js',
//     publicPath: '/',
//     stats: {
//         colors: true,
//     },
//     historyApiFallback: true,
// }));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    console.log(req.originalUrl);
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err.toString()+err.stack);
        });

}


// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('error');
    console.log(err);
});



//=============


// if(process.env.NODE_ENV !== 'production'){
// //    load config file
// //    set variable in config file to process.env variables
// }



//===== END SPOTIFY CALLS =======

// Listen on port 8888
app.listen(process.env.PORT || 8888, () => {
    console.log("App running on port 8888!");
    // console.log(`SPOTIFY_CLIENT_ID: ${process.env.SPOTIFY_CLIENT_ID}`)
    // console.log(`SPOTIFY_CLIENT_SECRET: ${process.env.SPOTIFY_CLIENT_SECRET}`)
});


// var server = app.listen(8888, function() {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Showcase app listening at http://%s:%s', host, port);
// });

// "eventful_key": "SrqR8jxMKfBH4qk6",
    // "jambase_key": "7pdhhmpt96tfr2k36bmq6b4w",