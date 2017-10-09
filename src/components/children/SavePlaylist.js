import React from "react";

import {hashHistory} from 'react-router';
import {Col, Thumbnail} from 'react-bootstrap';

export default class SavePlaylist extends React.Component {
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
            results: {},
            finalArtists: [],


        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        // window.location.replace("/dashboard");
        //TODO Need to pass in the current username state from the parent
        hashHistory.push(`/dashboard/${this.state.username}`);

    }

    componentWillMount() {
        // this.props.updateUsername(this.props.params.username);
        this.setState({finalArtists: this.props.getFinalArtists()}, () => {
        });


    }

    render() {
        // let pic = {
        //     uri: JSON.parse(localStorage.getItem("profileInfo"))
        // };

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="header">
                            <img alt="Showcase" className="showcase"
                                 src={require('../../../public/assets/showcaseheader.png')}/>
                            <p className="savePlaylist">Your playlist has been successfully created on Spotify!</p>

                        </div>
                    </div>
                    <div>
                        {this.state.finalArtists.map((val, index) => {
                            return <div key={index}>

                                <Col xs={6} md={4}>
                                    <Thumbnail className="imageSize" src={val.image}>
                                        <h3>Artist: {val.name}</h3>
                                        <p>Top track: {val.trackInfo[0].name}</p>
                                        <p> Date of show: {val.songkickData[0].date}</p>
                                        <p> More info: <a className="" target="_blank"
                                                          href={val.songkickData[0].uri}>{val.songkickData[0].title}</a>
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
                            <button className="btn btn-primary loginBtn" onClick={() => this.handleSpotify()}>View in
                                Spotify
                            </button>
                            <button className="btn btn-primary loginBtn" onClick={() => this.handleClick()}>Back To
                                Dashboard
                            </button>
                        </div>
                    </div>


                </div>
            </div>



        );
    }

}