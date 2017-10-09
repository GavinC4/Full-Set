/*
FIle that houses all of the requests to the songkick API
 */


/*TODO In order to get information by location I need to do two searches:
1. Do a search by geo location using this format: http://api.songkick.com/api/3.0/search/locations.json?location=geo:{lat,lng}&apikey={your_api_key}
2. Then take the location id from the response and perform a second call to get the calendars by metro area using: http://api.songkick.com/api/3.0/metro_areas/{metro_area_id}/calendar.json?apikey={your_api_key}
3. Then filter by date and time and throw all of the:
    -URI (link to song kick data)
    -Displayname (how artist is displayed with the venue
    -Start objet (gives start time
    -Location object
    -Venue.displayname

 */

//TODO need to start these calls right on successfull login of the use

'use strict';

// var axios = require('axios');
// var config = require('../../config/config.json');

import axios from "axios";
// import config from '../../config/config.json';

if(process.env.NODE_ENV !== 'production') {
    var config = require('../../config/config.json');

    var songkick_key = config.songkick_key;
} else {
    songkick_key = process.env.SONGKICK_KEY;
}

//Seed data to test songkick api
// let geoLocation = "30.2672,-97.7431";
// let minDate = "2017-02-11";
// let maxDate = "2017-02-12";


//This is the final array
let songkickArtists = {totalShows:[], shows:[]};

let songkickConfig = {headers: {
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Headers': 'Accept, Content-Type, X-Requested-With',
    // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    // 'Accept': 'application/json, text/plain, */*',
    'Content-Type':'application/x-www-form-urlencoded'

}}
const helpers = {

    // songkick_key: config.songkick_key,

//   Songkick API call that will use the geolcation, min date and max date to pull a range of concerts and then store them in the songkickArtsits array
    getConcerts: (geoLocation, minDate, maxDate) => {

        // let queryURL = "http://api.songkick.com/api/3.0/events.json?apikey="+songkick_key+"&location=geo:"+geoLocation+"&min_date="+minDate+"&max_date="+maxDate;
        let queryURL = `/songkick/${geoLocation}/${minDate}/${maxDate}`;
        return axios.get(queryURL).then((results)=>{
            // let totalEntries = {};
            let totalEntries = results.data.resultsPage.totalEntries;
            songkickArtists.totalShows.push(totalEntries);
           let apiArray = results.data.resultsPage.results.event;

           //first forEach that gets all of the events
           apiArray.forEach((val, index, array)=>{

               let artists = {};
               // artists.name = val.performance[0].displayName;
               artists.concertTitle = val.displayName;
               artists.venue = val.venue.displayName;
               artists.uri = val.uri;
               artists.time = val.start.time;
               artists.date = val.start.date;
               // artists.name = [];


               let perfArray = array[index].performance;
               let artistName = [];


               //second forEach loop that pulls out all of the artist names for each event
               perfArray.forEach((valPerf, indexPerf)=>{

                    artistName[indexPerf] = valPerf.displayName;
                    artists.name = artistName;
               });

               songkickArtists.shows.push(artists);

           });

        // console.log(songkickArtists);
        return songkickArtists;

        })


    },
    //This function will loop through selected events from date range and pull out all artists names to be used in Spotify call
    getSongKickArtists: (artistResults) => {
        let selectedArtists = [];
        console.log("In GET SONG KICK ARTIST FUNCTION: ", artistResults.shows);
        let loopArray = artistResults.shows;
        // first forEach to loop over the show
        loopArray.forEach((val)=> {
        // console.log("VAL OF Loop Array: ", val);
            let artistName = val.name;
            //second forEach to loop over the name in each show

            //error handle for the songkick data that don't contain names
            if(artistName !== 'undefined' || artistName !== null){
                artistName.forEach((val2) =>{
                    // console.log("VAL@@@ OF Loop Array: ", val2);

                    //    might need to put error handling if array only contains one element
                    selectedArtists.push(val2);
                    // console.log("Selected artists: ", selectedArtists);
                });

            }

        });
        // console.log(selectedArtists);
        return selectedArtists;
    }

}

// helpers.getConcerts(geoLocation, minDate, maxDate);

// module.exports = helpers;
export default helpers;
