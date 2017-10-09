

const express = require('express'),
    dbController = require('../controllers/dbController'),
    spotifyController = require('../controllers/spotifyController'),
    apiProxyController = require('../controllers/apiProxyController'),
    router = express.Router();

//Route to handle the CORS error and use the server as a proxy
router.get('/songkick/:geolocation/:mindate/:maxdate', apiProxyController.proxyServer);

//Possibly to handle the spotify redirect to dashboard
router.get('/login', spotifyController.login);

//this is the second route for the Spotify oAuth process
router.get('/callback', spotifyController.callback);

//Route for the Spotify refresh token
router.get('/refresh_token', spotifyController.refresh);

//Route to create playlist
// router.get('/createplaylist/:genre', spotifyController.create);

router.get('/createplaylist', spotifyController.create);


// router.get('/getdata', dbController.getData);


module.exports = router;
