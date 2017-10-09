//File to handle Server as a proxy

var request = require('request'); // "Request" library

if(process.env.NODE_ENV !== 'production') {
    var config = require('../src/config/config.json');

    var songkick_key = config.songkick_key;
} else {
    songkick_key = process.env.SONGKICK_KEY;
}

// var apiServerHost = 'http://api.songkick.com';
var allowedHeaders = [
    'X-Requested-With',
    'Access-Control-Allow-Headers',
    'content-type'
];

// "http://api.songkick.com/api/3.0/events.json?apikey="+songkick_key+"&location=geo:"+geoLocation+"&min_date="+minDate+"&max_date="+maxDate;

let proxyControllers = {
    proxyServer: (req, res) =>{
        console.log("the req url: ", req.url);

        let geoLocation = req.params.geolocation;
        let minDate = req.params.mindate;
        let maxDate = req.params.maxdate;

        console.log("geolocation: ", geoLocation);
        console.log("geolocation: ", minDate + "  " + maxDate);

        var apiServerHost = "http://api.songkick.com/api/3.0/events.json?apikey="+songkick_key+"&location=geo:"+geoLocation+"&min_date="+minDate+"&max_date="+maxDate;
        res.append('Access-Control-Allow-Origin', '*');
        res.append('Access-Control-Allow-Headers', allowedHeaders.join(', '));

        if (req.method === 'OPTIONS') {
            res.status(200).send();
        }
        else {
            var url = apiServerHost;
            req.pipe(request(url)).pipe(res);
        //    TODO need to get the results back into songKickHelper file
        }

    }
}

module.exports = proxyControllers;