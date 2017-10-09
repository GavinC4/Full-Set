/*
This file handles all of the database logic for Redis
 */

// var redis = require('redis');
// var client = redis.createClient();
var querystring = require('querystring');
var request = require('request'); // "Request" library

// client.on('connect', function() {
//     console.log('Redis connected');
// });


let dbControllers = {

    //This function sets the intial data received on login into the database
    setData: (user) => {

        client.hmset(user.key, {
            'country':user.country,
            'fullname': user.fullname,
            'spotifyID': user.spotifyID,
            'profileImage': user.profileImage,
            'email': user.email,
            'accessToken': user.accessToken,
            'refreshToken': user.refreshToken,
        })

    },

    //Not Using this currently, using Session storage to retrieve data instead
    getData: (req, res) => {
        let access_token ="";
        console.log("Session data in getData: " , req.session);
        // console.log("Params coming in: " ,  req.query.ID);
        // console.log("In the DB CONTROLLER: " , req.query.genre);

        //TODO Figure out how to get the session.key into this piece
        let spotifyID = "nfinleymusic"
        client.hgetall(spotifyID, function (err, object) {
            // console.log("From REDIS DB: " , object);
            // console.log("REDIS ACCESS: " , object.accessToken);
            // console.log("Spotify ID: " , object.spotifyID);

            access_token = object.accessToken;
            spotifyID = object.spotifyID;




        });
        res.redirect('/createplaylist/' +
            querystring.stringify({
                tracks: req.query.ID,
                genre: req.query.genre,
                spotifyID: spotifyID,
                access_token: access_token,

            }));

        //    let accessData = {
        //     url:'/createplaylist',
        //     body: querystring.stringify({
        //         tracks: req.query.ID,
        //         genre: req.query.genre,
        //         spotifyID: spotifyID,
        //         access_token: access_token,
        //
        //     }),
        //     json:true
        //
        // };
        //
        // request.post(accessData, function (error, response, body){
        //    console.log("POST TO createplaylist route: " , response);
        // });
    }



}





module.exports = dbControllers;


        // request.post('/createplaylist/' +
        //     querystring.stringify({
        //         tracks: req.query.ID,
        //         genre: req.query.genre,
        //         spotifyID: spotifyID,
        //         access_token: access_token,
        //
        //     }));