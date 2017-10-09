

/*The Generate Playlist pag
* This page is where the playlists will be generated after the user selects the parameters in the dasboard page
*
*/

//TODO Create a button that takes the users back to the dashboard

import React from 'react';
import { Link, hashHistory } from 'react-router';
import {Col, Thumbnail} from 'react-bootstrap';

import Helpers from '.././utils/helpers';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            location: "",
            username: "",
            profileimage: "",
            search: {
                artist: "",
            },
            genre: "test",
            results: {},
            finalArtists: [],

            songKickResults: []

        }
        this.handleClick=this.handleClick.bind(this);
        // this.props.profileInfo = JSON.parse(localStorage.getItem("profileInfo"));

    }
    componentWillMount(){
        //Because the information that gets passed from the sibling component is not available when the component mounts because
        //it is asynchronous you have to run this check for new information after the Rendering since Component will mount happens before the render
        this.setState({results: this.props.getSpotifyResults()}, ()=> {});
        this.setState({genre: this.props.getPlaylistName()}, ()=> {});
        //TODO make sure the that data coming in with the final artists content includes the all of the songkick data
        this.setState({finalArtists: this.props.getFinalArtists()}, ()=> {});
        // this.setState({: this.props.getSpotifyResults()}, ()=> {});

        // this.props.getUsername(this.props.params.username);

    }

    //This handles the click and sends it to the create playlist node route to query Spotify
    handleClick(e) {
        e.preventDefault();

        // console.log("Inside Handle click of generate: " , req.session);
        let genre = 'Showcase ' + this.state.genre;
        let array = this.generateTrackIDList(this.props.getFinalArtists())

        Helpers.getTrackID(array, genre).then((results)=>{
            hashHistory.push("/saveplaylist");
        })

    }

    generateTrackIDList(artistList){
    //    parse the final artists array to get the ids
        let finalTracks = [];
        artistList.forEach(function(val){
            val.trackInfo.forEach(function (val2){
                finalTracks.push(val2.uri);

            })

        })
        return finalTracks;

    }


    render(){
        // console.log("Generate State Object: ", this.state.results);
        // console.log(this.state.genre);
        console.log("Final artists in generate state: " , this.state.finalArtists);



        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="header">
                            <img alt="Showcase" className="showcase" src={require('../../../public/assets/showcaseheader.png')}/>
                            <h1>Your Artists in the {this.state.genre} genre</h1>
                        </div>
                    </div>
                    <div>
                        {this.state.finalArtists.map((val, index)=> {
                            return <div key={index} >

                                <Col xs={6} md={4}>
                                    <Thumbnail className="imageSize" src={val.image}>
                                        <h3>Artist: {val.name}</h3>
                                        <p>Top track: {val.trackInfo[0].name}</p>
                                        <p> Date of show: {val.songkickData[0].date}</p>
                                        <p> More info: <a className="" target="_blank" href={val.songkickData[0].uri}>{val.songkickData[0].title}</a>
                                        </p>
                                        <p></p>
                                        {/*<p> <a className="footerlink" href="http://www.songkick.com/"><img alt="Songkick" className="songkick" src={require('../../../public/assets/powered-by-songkick-pink.png')}/></a></p>*/}
                                    </Thumbnail>
                                </Col>

                            </div>
                        }, this)}
                    </div>

                </div>
                <div className="row">

                    <div className="col-md-12">
                        <div className="header">
                            <button className="btn btn-primary loginBtn" onClick={this.handleClick}>Generate and Save Playlist to Spotify</button>
                        </div>
                    </div>


                </div>
            </div>



        );
    }

}