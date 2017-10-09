//The Dashboard page: Is where the user will come to select the frequency in which their playlist is generated and the genre they want to select
/*
*/



//TODO: To get the app to work start by seeding artists in a dropdown (since songkick hasn't gotten back to me)
//TODO Make the Location seperate from the form to generate the playlist

//TODO : FOR Location - save to the database
//This.ref can be used to change the compiled code

//TODO: DATABASE - Using Redis save the username and id information and location
/*  What I need:
* From Song Kick: The bands that are coming into town based on the user location in a given time frame
* If I can't: Either use Bands in Town or Seed a bunch of local austin artists
* Then use a genre filter in Spotify to only pull back the artists from Songkick/Bands in town  with that tag on it
*
*
 */

import React from 'react';
import {Link, hashHistory} from 'react-router';
import Datetime from 'react-datetime';
import moment from 'moment';

// import Nav from './Nav';

import Helpers from '.././utils/helpers';
import Songkick from '.././utils/songkickHelper';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            location: "",
            username: "",
            profileimage: "",
            search: {
                artist: "",
                genre: ""

            },
            beginDate: {
                startdate: "",
            },
            endDate: {
                enddate: ""
            },
            startValue:  "",
            endValue: "",


            results: {},



        }
        // this.props.profileInfo = JSON.parse(localStorage.getItem("profileInfo"));
        this.handleChange =this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
    }

    //This function handles the user input in the form field
    handleChange(e) {
        let newGenre = {};
        newGenre[e.target.id] = e.target.value;
        this.setState({search: newGenre});
        // console.log(this.state.search.genre);
    }

    handleStartDate(e){
        // old text input way
        // let startDate = {};
        // startDate[e.target.id] = e.target.value;
        // this.setState({beginDate: startDate});
        // console.log(this.state.beginDate.startdate);
        // console.log(e.value);


        let date = e.format("YYYY-MM-DD");
        this.state.startValue = date;
        // this.setState({startValue: date});
        console.log("State:", this.state.startValue);
    }

    handleEndDate(e){
        // console.log(e.target.id);
        // console.log(e.target.value);
        //
        // let endDate = {};
        // endDate[e.target.id] = e.target.value;
        // console.log(endDate);
        // this.setState({endDate: endDate});


        let enddate = e.format("YYYY-MM-DD");
        this.state.endValue = enddate;
        // this.setState({startValue: date});
        console.log("State:", this.state.endValue);
    }

/* This function handles the 'generate playlist' button click and takes the value from the input field and calls the Spotify api in the helper file to grab the correct results
and then it assigns the results to the Layout's state which will then be passed into the Generate Playlist component
*/
    handleSubmit(e) {

        e.preventDefault();
        console.log("click!", this.state.startValue, this.state.endValue, this.state.search.genre);

        let genre = this.state.search.genre.toLowerCase();
        this.props.updatePlaylistName(genre);

        //parameters for the songkick query
        let geoLocation = "30.2672,-97.7431";
        let minDate = this.state.startValue
        let maxDate = this.state.endValue;



        Songkick.getConcerts(geoLocation, minDate, maxDate).then((fullArtistsArray)=>{
            this.props.updateSongKickResults(fullArtistsArray);
            // console.log("In .then of songkick: ", this.props.getSongKickResults());

            let skArtists = Songkick.getSongKickArtists(fullArtistsArray);

            Helpers.getArtist(genre, skArtists, fullArtistsArray).then((results) => {
                // console.log("IN DASHBOARD: " , results);
                Helpers.getSongs().then(()=> {

                    this.props.updateSpotifyResults(results);  //artist selection and track selection
                    this.props.updateFinalArtists(this.parseSpotifyResults(results));   //final artist results
                    // console.log("Result state: ", this.props.getSpotifyResults());


                    hashHistory.push("/generateplaylist");

                })
            })

        })

    }

    //parses the data received from the user selecting a genre resulting in an object of artists and their top tracks
    parseSpotifyResults(data) {
        let trackData = data.topTracks[0];
        let artists = data.genreArtists;
        let concertInfo = data.songKickData;

        let finalArtists = [];

        //loops over the artist array to pull out artist info
        artists.forEach((artistVal)=>{
            let artistInfo = {};
            artistInfo.name = artistVal.items[0].name;
            console.log("Artists Name: ", artistInfo.name);

            artistInfo.id = artistVal.items[0].id;
            artistInfo.image = artistVal.items[0].images[0].url;
            // artistInfo.genres = artistVal.items[0].genres;
            artistInfo.trackInfo = [];
            artistInfo.songkickData = [];
            finalArtists.push(artistInfo);
            console.log("Artist info object: ", artistInfo);
            console.log("FINAL ARTIST array: ", finalArtists);

        })
        // loops over each track array and pulls out track data need to add songs to the playlist
        trackData.forEach((val, trackIndex)=>{
            //loops over each track array and pulls out the name and the id
            //TODO write logic to look at the length of the artist array and based on the length only pull out certain numbers of ids
            val.data.tracks.forEach(function(trackVal){
                let tracks = {};
                tracks.name = trackVal.name;
                tracks.uri = trackVal.uri;
                tracks.preview_url = trackVal.preview_url;

                finalArtists[trackIndex].trackInfo.push(tracks);

            })

        })
        //    loops over the concertInfo and pushes it to the finalArtists array
        concertInfo.forEach((concertVal, index)=>{

            let concertData = {};
            concertData.title = concertVal.concertTitle;
            concertData.date = concertVal.date;
            concertData.time = concertVal.time;
            concertData.uri = concertVal.uri;
            concertData.venue = concertVal.venue;

            finalArtists[index].songkickData.push(concertData);
            console.log("concertInfo: ", finalArtists);


        })
        console.log("This is the final artists array: ", finalArtists);
        return finalArtists;



    }

    componentWillMount() {
        // console.log(this.props.params.profileimage);
        this.props.updateUsername(this.props.params.username);
        this.props.updateProfilePic(this.props.profileimage);
    }
    //TODO  ADD DATE FILTERS or Showcase filters, like `Showcase today` or choose dates with min and max dates

    render() {
        // let pic = {
        //     uri: JSON.parse(localStorage.getItem("profileInfo"))
        // };

        var yesterday = Datetime.moment().subtract( 1, 'day' );

        //function that will ensure no previous date can be selected by user on the date picker
        var valid = function( current ){
            return current.isAfter( yesterday );
        };

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="header">
                            <img alt="Showcase" className="showcase"
                                 src={require('../../../public/assets/showcaseheader.png')}/>
                            <p>Discover and listen to new bands before they come into your town and then go see them
                                live. </p>

                            {/*This is to set the user location*/}
                            {/*<form>*/}
                                {/*<div className="form-group">*/}
                                {/*<h4> Set Your Location</h4>*/}
                                {/*<input className="" type="text" id="location" />*/}
                                {/*<button type="submit" className="btn btn-primary" >Set</button>*/}
                                {/*</div>*/}
                            {/*</form>*/}

                            <form >
                                <div className="form-group">
                                    <h4 className="">
                                        <strong>Choose Start Date</strong>
                                    </h4>
                                    {/*<input*/}
                                        {/*onChange={this.handleStartDate}*/}
                                        {/*type="text"*/}
                                        {/*className="form-control"*/}
                                        {/*id="startdate"*/}
                                        {/*placeholder="YYYY-MM-DD"*/}
                                        {/*required*/}
                                    {/*/>*/}
                                    <Datetime timeFormat={false}
                                              onChange={this.handleStartDate}
                                              isValidDate={ valid }
                                              value={this.state.startValue}

                                              closeOnSelect={true}
                                              defaultFormat="YYYY-MM-DD"
                                              id="startdate"
                                              required
                                    />

                                    <h4 className="">
                                        <strong>Choose End Date</strong>
                                    </h4>
                                    {/*<input*/}
                                        {/*onChange={this.handleEndDate}*/}

                                        {/*type="text"*/}
                                        {/*className="form-control"*/}
                                        {/*id="enddate"*/}
                                        {/*placeholder="YYYY-MM-DD"*/}
                                        {/*required*/}
                                    {/*/>*/}
                                    <Datetime timeFormat={false}
                                              onChange={this.handleEndDate}
                                              isValidDate={ valid }
                                              value={this.state.endValue}

                                              closeOnSelect={true}
                                              defaultFormat="YYYY-MM-DD"
                                              id="enddate"
                                              required
                                    />
                                    <h4 className="">
                                        <strong>Choose Your Genre</strong>
                                    </h4>
                                    <input onChange={this.handleChange}
                                        type="text"
                                        className="form-control"
                                        id="genre"
                                        required
                                    />
                                    {/*<label className="radio-inline" id="genre">*/}
                                        {/*<input type="radio" value=""/> Pop*/}

                                    {/*</label>*/}
                                    {/*<label className="radio-inline" id="genre">*/}
                                        {/*<input type="radio" value=""/> Rock*/}

                                    {/*</label>*/}
                                    <div>
                                    <button className="btn btn-primary loginBtn" onClick ={this.handleSubmit}>Show Me Artists
                                    </button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>



                </div>
            </div>



        );
    }

}