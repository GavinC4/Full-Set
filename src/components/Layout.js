import React from 'react';
// import { Link } from 'react-router';

// import Nav from "../components/children/Nav";
import Footer from "../components/children/Footer";


export default class Layout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: true,
            username: "guest",
            profileimage: "",
            genre: "",
            results: {},
            finalArtists: [],
            songKickResults: []

        }


        this.updateUsername = this.updateUsername.bind(this);
        this.updateProfilePic = this.updateProfilePic.bind(this);
        this.updateProfilePic = this.updateProfilePic.bind(this);

        this.updateSpotifyResults = this.updateSpotifyResults.bind(this);
        this.getSpotifyResults = this.getSpotifyResults.bind(this);

        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.getPlaylistName=this.getPlaylistName.bind(this);

        this.getTrackIdList = this.getTrackIdList.bind(this);
        this.updateFinalArtists = this.updateFinalArtists.bind(this);
        this.getFinalArtists = this.getFinalArtists.bind(this);

        // this.getLocalStorage = this.getLocalStorage.bind(this);
        // this.props.pic
        this.updateSongKickResults = this.updateSongKickResults.bind(this);
        this.getSongKickResults = this.getSongKickResults.bind(this);



    }

    //this function controls when the Nav bar collapses
    toggleCollapse() {
        const collapsed = !this.state.collapsed;
        this.setState({collapsed});

    }

    updateUsername(user){
        this.setState({username : user});
    }

    updateProfilePic(pic){
        this.setState({profileimage: pic});
    }

    updateSpotifyResults(results) {
        this.setState({results: results});
        // console.log("update results", results);

    }

    getSpotifyResults(){
        // console.log("get results", this.state.results);
        return this.state.results;

    }

    updatePlaylistName(genre){
        this.setState({genre: genre});
        console.log("genre in layout", genre);
    }

    getPlaylistName(){
        console.log("genre being sent back", this.state.genre);
        return this.state.genre;
    }

    getTrackIdList(){
        return this.state.results
    }

    updateFinalArtists(finalArtists){
        this.setState({finalArtists: finalArtists})
        console.log("Final artists array in Layout:" , this.state.finalArtists)
    }

    getFinalArtists(){
        return this.state.finalArtists;

    }

    updateSongKickResults(songKickResults) {
        this.setState({songKickResults: songKickResults});
        console.log("SongKICK ARTISTS array in Layout:" , this.state.songKickResults);

    }

    getSongKickResults(){
        return this.state.songKickResults;
    }

    // //This function takes the top tracks from the search makes them a part of layout state.
    // updateTrackResults(tracks){
    //     this.setState({tracks: tracks});
    //     console.log("track update results", this.state.tracks);
    //
    //
    // }
    //
    // getTrackResults(){
    //     console.log("get TRACK results", this.state.tracks);
    //     return this.state.tracks;
    // }


    // getLocalStorage() {
    //     return localStorage.getItem(profileImage);
    //     console.log()
    // }

    render() {
        // console.log("the location prop: ", this.props.location);
        const {location} = this.props;
        const containerStyle = {
            marginTop: "60px"
        };
        // const {location} = this.props;
        const {collapsed} = this.state;
        const loginClass = location.pathname === "/" ? "active" : "";
        // const archivesClass = location.pathname.match(/^\/archives/) ? "active" : "";
        // const settingsClass = location.pathname.match(/^\/settings/) ? "active" : "";
        const navClass = collapsed ? "collapse" : "";

        return (
            <div>
                <nav className="navbar navbar-default" role="navigation">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle"
                                    onClick={this.toggleCollapse.bind(this)} aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="/">
                                <img alt="Showcase" className="showcase" src={require('../../public/assets/ShowcaseLogoNav.png')}/></a>
                        </div>

                        <div className={"navbar-collapse" + navClass} id="bs-example-navbar-collapse-1">

                            <ul className="nav navbar-nav navbar-right">

                                <a className="navbar-brand" href="#">
                                    <img alt="" className="profilePic" src={this.state.profileimage}/></a>
                                <p className="navbar-text">Hi, {this.state.username} </p>

                            </ul>
                        </div>

                    </div>

                </nav>


                <div className="container" style={containerStyle}>
                    <div className="row">
                        <div className="col-md-12">
                            {React.cloneElement(this.props.children,
                                {
                                    updateUsername:this.updateUsername,
                                    updateProfilePic:this.updateProfilePic,
                                    updateSpotifyResults: this.updateSpotifyResults,
                                    getSpotifyResults: this.getSpotifyResults,
                                    updatePlaylistName: this.updatePlaylistName,
                                    getPlaylistName: this.getPlaylistName,
                                    getTrackIdList: this.getTrackIdList,
                                    getFinalArtists: this.getFinalArtists,
                                    updateFinalArtists: this.updateFinalArtists,
                                    getSongKickResults: this.getSongKickResults,
                                    updateSongKickResults: this.updateSongKickResults

                                })}
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>


        );
    }

}