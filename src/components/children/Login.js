
//This is the Login page that the user will see when first going to the page. They have to click on the login button which will redirect them to Spotify

import React from 'react';
import { Link } from 'react-router';

//might need to import something for the Spotify piece

//add the spotify logic to the login page. Use an onclick function to bind to spotify call use the handle click to forward it to the axios helper file

export default class Login extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            location: "",


        }
        this.handleClick=this.handleClick.bind(this)
    }
    handleClick() {
        window.location.replace("/login")

    }

    render(){

        return (
          <div>
              <div className="row">
                <div className="col-md-12">
                    <div className="header">
                        <img alt="Showcase" className="showcase" src={require('../../../public/assets/showcaseheader.png')}/>
                        <p className="intro"> Welcome Showcase! </p>
                        <p className="intro"> Showcase is a new music discovery app that generates playlists based on bands coming to your town in genres you like. Listen to your favorite bands on tour before they come to town.
                        </p>
                        <p className="intro2"> To get started, login with your Spotify credentials below. </p>
                        <button className="btn btn-primary loginBtn" onClick={()=>this.handleClick()}>Log in with Spotify
                        </button>
                    </div>
                </div>
              </div>

          </div>


        );
    }

}