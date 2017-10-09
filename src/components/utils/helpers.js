//This file contains all of the helpers function that deal with Spotify and the API calls.

'use strict';

import axios from "axios";
import Songkick from './songkickHelper';

import _ from 'lodash';
//seeded artists. Using until Songkick provides the API
const artists = [
    "Spoon",
    "Bob Schneider",
    "The Black Angels",
    "Ghostland Observatory",
    "Quiet Company",
    "Ariana Grande",
    "Beyonce",
    "John Legend",
    "The Killers",
    "Tove Lo",
    "A Tribe Called Quest",
    "Justin Bieber",
    "Bruno Mars",
    "Korn",
    "Metalica",
    "Disclosure",
    "Kendrick Lamar",
    "Adele",
    "Justin Timberlake",
    "Pixies", "Coldplay",
    "Chance The Rapper",
    "Miley Cyrus",
    "Stevie Wonder",
    "Lorde",
    "Iron Maiden",
    "Nirvana",
    "Eagles",
    "AC/DC",
    "Pat Green",
    "George Strait",
    "Black Sabbath",
];


//This array has all of the initial artist info from Spotify, just a temp array.
let newArtists = [];

//This array only has those artists that match the genre search typed in by the user. TODO pass this artist info into components and use to display info
let genreArtists = [];

//This array contains the artist Ids generated by the user Genre filter search
let artistId = [];

//This array contains the top tracks by the artists.
let topTracks = [];

let allArtistData = {genreArtists: [], topTracks: [], songKickData: []};

//intialize variable that will be used to test if the id of the artists already exists in the array
let existingId;

//Array used to house the filtered Spotify artists data to exclude any artists that have empty genre arrays
let filteredArtistArray = [];

//houses the spotify matched names temporarily in order to push songkick data into main object
let tempSpotifyNameArray= [];

const helpers = {

    //Searching the Spotify API and retrieving the artists with the names from the Songkick call made previously and passed in as a parameter
    getArtist: (genre, skArtists, allArtists) => {
        console.log("Total sk artists array: ", allArtists.shows);
        //TODO figure out how to take this data and only pull out those that are widlled down from the genre.


        skArtists.forEach((val) => {
            // console.log("Name of artist to search in spotify: ", val);
            let queryURL = "https://api.spotify.com/v1/search?q=" + val + "&type=artist&market=US&offset=0&limit=1";
            newArtists.push(axios.get(queryURL))

        });
        //This returns all artist spotify information based on songkick artists
        return axios.all(newArtists).then((results) => {

            console.log("Initial getARtist results: ", results);


            helpers.filterGenre(results);
            console.log(filteredArtistArray);

            //First forEach that loops over the entire result set
            filteredArtistArray.forEach((val2, index, arr)=> {
                // console.log("All of the genres: " , arr[index].data.artists.items[0].genres);

                //TODO when spotify limit to at least 2 or 3 is increased need to loop of the objects in items to match the names against the songkick names and then push that array
                let items = arr[index].data.artists.items[0].genres;
                let spotifyName = arr[index].data.artists.items[0].name;
                console.log("This is the items ", items);


                for (var i = 0; i < items.length; i++) {
                    // console.log(items);

                        //This checks the user input to see if it matches any piece of the user input in the genre array
                        if (items[i].includes(genre)) {
                            // console.log(items[i]);

                            existingId = arr[index].data.artists.items[0].id;

                            //if statement to check to see if that artist is already in the array if not push to genreAritst array and artistsId array
                            if (!artistId.find(helpers.foundGenre)) {

                                //only push if the  item is not already in the array
                                allArtistData.genreArtists.push(arr[index].data.artists);
                                artistId.push(existingId);
                                // console.log("This is allArtistData in getArtist:",  allArtistData );
                                tempSpotifyNameArray.push(spotifyName);

                            }
                        }
                    }

            });
            console.log("This is allArtistData in getArtist:", allArtistData);

            helpers.pushSongKickArtist(allArtists, tempSpotifyNameArray);

            // console.log(artistId);
            return allArtistData;

        })
    },

    //This function queries Spotify using the artist IDs pulled from the initial filter by genre using original artist array
    getSongs: () => {

        artistId.forEach((artistID) => {
            let queryURL = "https://api.spotify.com/v1/artists/" + artistID + "/top-tracks?country=US";
            topTracks.push(axios.get(queryURL));

        });
        return axios.all(topTracks).then((results) => {


            // console.log("NEW GENRE ARTIST ARRAY: ", genreArtists);
            allArtistData.topTracks.push(results);

            // results = allArtistData.topTracks;
            // console.log("Top tracks array and artists in Object: ", allArtistData);
            return allArtistData;

            // return [genreArtists, results];
        })

    },

    //function to check to see if element ID already exists in allArtistArray
    foundGenre: (element) => {
        return element == existingId;
    },


    //This parses the track IDS from the generate component and sends the data to the create playlist route
    getTrackID: (array, genre) => {
        console.log("In the get TrackID: ", array + " " + genre);

        let newString = array.join(",");

        return axios.get('/createplaylist', {
            params: {
                tracks: newString,
                genre: genre,

            },

        })

    },
    //This function takes the spotify artist results and removes all artists that don't have genres in their genre fields and returns a new array
    filterGenre: (array) => {
        console.log(array);
        array.forEach((val, index, arr)=>{
          // console.log("Filtered array val: ", val.data.artists.items);
            let items = val.data.artists.items;
            items.forEach((val2)=>{

                let newGenres = val2.genres[0];

                if(typeof newGenres !== 'undefined'){
                    filteredArtistArray.push(arr[index]);

                }

            })
        });
        //New array of artists that have
        return filteredArtistArray;

    },
    //This function finds the matching songkick artists from the temp Spotify artist name array and then pushes the songkick artist info to Final Artists array
    pushSongKickArtist: (skArray, spotifyArray) =>{
        // console.log("The Temp Spotify array list: ", spotifyArray);

        spotifyArray.forEach((spotVal, spotIndex, spotArray)=>{
            let spotifyName2 = spotVal;
            // console.log("INITIAL SPOT MATCH NAME: " , spotifyName2);

            // helpers.identifySongKickMatch(spotifyName2)
            skArray.shows.forEach((valShow, index, array)=> {
                // console.log("The song kick array list: ", array);

                let songkickArray = valShow.name;

                songkickArray.forEach((valName, index2, array2) =>{
                    let skName = valName;
                    // console.log("Each Array of Songkick Artist Names: ", array2);

                    //checking to see if the names match from the filtered spotify list and the songkick data and if so push it to the allArtistsData array.
                    if(skName.toLowerCase() === spotifyName2.toLowerCase()){

                        // console.log("SongKick name: " , skName);
                        // console.log("Spot name: " , spotifyName2);
                        allArtistData.songKickData.push(array[index])
                        console.log("allaaaaartistData: ", allArtistData);
                    }

                })

            });


        })



    },

    //    ===== END HELPERS
};

export default helpers;

