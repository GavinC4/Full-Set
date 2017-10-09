import React from "react";


export default class Footer extends React.Component {
    render() {
        return (
            <footer>
                <div className="row">
                    <div className="col-lg-12">
                    <div className="footer">
                        <p>Playlisting powered by <span className="spotify"> Spotify</span> and Concert data <a className="footerlink" href="http://www.songkick.com/"><img alt="Songkick" className="songkick" src={require('../../../public/assets/powered-by-songkick-pink.png')}/></a>

                        </p><p>&copy; Showcase 2017</p>
                    </div>
                    </div>
                </div>
            </footer>
        );
    }
}