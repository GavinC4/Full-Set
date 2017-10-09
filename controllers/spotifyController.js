//spotify controller file to handle the login

//=====Dependencies For the Spotify calls =====
var request = require('request'); // "Request" library
var querystring = require('querystring');

if(process.env.NODE_ENV !== 'production') {
    var config = require('../src/config/config.json');
    //DEV Environment
    var client_id = config.client_id, // Your client id
        client_secret= config.client_secret, // Your secret
        redirect_uri ='http://localhost:8888/callback';
} else {
    //Production ENV
    var client_id = process.env.SPOTIFY_CLIENT_ID, // Your client id
        client_secret = process.env.SPOTIFY_CLIENT_SECRET, // Your secret
        redirect_uri = 'http://discovershowcase.herokuapp.com/callback';

}



let controllers = {


    // client_id: process.env.SPOTIFY_CLIENT_ID, // Your client id
    // client_secret: process.env.SPOTIFY_CLIENT_SECRET, // Your secret
    // redirect_uri: 'http://discovershowcase.herokuapp.com/callback',

    // //DEV Environment
    // client_id: config.client_id, // Your client id
    // client_secret: config.client_secret, // Your secret
    // redirect_uri: 'http://localhost:8888/callback',

    // console.log("id: " + config.client_id);
    // console.log("secret:  " + config.client_secret);

    // ============ SPOTIFY CALLS ====================

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    generateRandomString: ((length) => {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }),

    // stateKey: 'spotify_auth_state',


    /*  ===== 1st GET route for the login that calls the /authorize. This call starts the process of authenticating to
     user and gets the user's authorization to access data.
     */
    login: (req, res) => {

        var state = controllers.generateRandomString(16);
        // res.cookie(controllers.stateKey, state);
        req.session.state = state;

        // your application requests authorization
        //  right now its asking for access to user subscription details, email and to modify public playlists
        var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            }));
    },


    /* ==== 2nd GET request =======
     This calls the Spotify Accounts Service's /api/token endpoint passing to it the authorization code returned  by the first
     call and the client secret key. This call returns an access token and also a refresh token
     */

    callback: (req, res) => {
        // your application requests refresh and access tokens
        // after checking the state parameter

        var code = req.query.code || null;
        var state = req.query.state || null;
        // var storedState = req.cookies ? req.cookies[controllers.stateKey] : null;
        var storedState = req.session.state;

        if (state === null || state !== storedState) {
            console.log(`state: ${state}`);
            console.log(`storedState: ${storedState}`);
            // console.log(`cookies: ${res.cookies}`);

            res.redirect('/#' +
                querystring.stringify({
                    error: 'state_mismatch'
                }));

        } else {
            // res.clearCookie(controllers.stateKey);
            delete req.session.state;
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                json: true
            };

            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {

                    var access_token = body.access_token,
                        refresh_token = body.refresh_token;

                    var options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function (error, response, body) {
                        //This shows all of the data that comes back.
                        // console.log("Server file data: ", body);
                        // console.log("tokens: ", options);
                        // console.log("cookie: ", req.cookies);



                        //creating a session key and storing the data in Redis based on this key
                        req.session.key = body.id;
                        req.session.token = access_token;
                        req.session.cookie.expires = false;

                        // req.session.cookie.path = '/createplaylist';

                        //Variable for old Redis storage method
                        let user = {
                            key: req.session.key,
                            country: body.country,
                            fullname: body.display_name,
                            spotifyID: body.id,
                            profileImage: body.images[0].url,
                            email: body.email,
                            accessToken: access_token,
                            refreshToken: refresh_token
                        }
                        //added
                        req.session.user = user;
                        req.session.save();
                        //
                        console.log("Session Data: ", req.session);
                        // console.log("Session Data: ", req.session.token);

                        //database controller call to store the new data use the express-session and connect-redis
                        // dbController.setData(user);


                        //    TODO write error logic to redirect them to login page if no session if req.session.key is uundefined go to login otherwise go to dashboard, need to do it on Layout page load


                    });

                    // we can also pass the token to the browser to make requests from there
                    res.redirect('/#' +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token
                        }));

                }
                //error handling if an error is received or the status code is not 200
                else {
                    res.redirect('/#' +
                        querystring.stringify({
                            error: 'invalid_token'
                        }));
                }
            });
        }

    },


    /*===== 3rd GET Request =======
     requests sent to /refresh_token and the token is sent to /api/token. This will generate a new access token
     that we can issue when the previous has expired.
     */
    refresh: (req, res) => {


        // requesting access token from refresh token
        var refresh_token = req.query.refresh_token;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;
                res.send({
                    'access_token': access_token
                });
            }


        })
    },

//    Function and server call to create a Spotify playlist and add tracks to the newly created playlist
    create: (req, res) => {

        //Nothing is in the session, need to figure out how to recall a previous session
        console.log("session user inCREATE : " , req.session);
        console.log("session user EMAIL : " , req.session.user.email);

        //coming in from the getTRackID in the helpers file
        let playlistName = req.query.genre;
        let spotifyTracks = req.query.tracks;

        //coming in from session storage
        let spotifyID = req.session.user.spotifyID;
        let access_token = req.session.user.accessToken;

        //let spotifyID = req.query.userID;
        // let access_token = req.query.token;

        // console.log("req.query ID String",  req.query.tracks);
        // console.log("req.query Genre",  req.query.genre);
        console.log("req.query Spotify ID",  spotifyID);
        console.log("req.query ACCESS TOK",  access_token);


        var authOptionsCreate = {
            url: 'https://api.spotify.com/v1/users/'+spotifyID+'/playlists',
            body: JSON.stringify({
                'name': playlistName,
                'public': false
            }),
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json',
            }
        };
        //Request to add tracks to the Spotify playlist
        return request.post(authOptionsCreate, function (error, response, body) {
            if (!error && response.statusCode === 201) {
                console.log("This is the body response from playlist creation: ", body);
                // console.log("ADD TRACKS", body.description, response);
                // console.log("A", body.description, response);
                // console.log("PLaylist id ", req.body.id);

                let myID= JSON.parse(response.body);
                let playID = myID.id;

                // "'3wQ7wzYE03He6re2WhdYfa'" FOR TESTING playlist in Spotify

                // ['spotify:track:2FMvTIIIVIS70zsLWOSwOT,spotify:track:1pKeFVVUOPjFsOABub0OaV,spotify:track:02M6vucOvmRfMxTXDUwRXu'];


                let authOptionsPlaylist = {
                    url: 'https://api.spotify.com/v1/users/'+spotifyID+'/playlists/'+playID+'/tracks?position=0&uris='+spotifyTracks,

                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Content-Type': 'application/json',
                    },
                    json: true
                }

                return request.post(authOptionsPlaylist, function (error, response, data) {
                    if (!error && response.statusCode === 201) {
                        console.log("Tracks added successfully to playlist: ", data);
                        // return data;
                        res.redirect('/#/saveplaylist');

                        //TODO Redirect to the save plalyist page here, probably send through axios to get back to react router


                    } else {
                        console.log("Tracks couldn't be added, ERROR: ", response.statusCode, +" " + error);
                        //    404 Not Found - The requested resource could not be found. This error can be due to a temporary or permanent condition.

                    }

                });


            } else {
                console.log("The playlist couldn't be created, ERROR: ", response.statusCode);
            }


        })


    }


}

module.exports = controllers;


