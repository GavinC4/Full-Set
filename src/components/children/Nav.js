//NO LONGER USING THIS COMPONENT

// import React from 'react';
// import {IndexLink, Link} from 'react-router';
// // import assets from ''
//
// export default class Nav extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             collapsed: true,
//             username: ""
//         };
//
//     }
//
// //this function controls when the Nav bar collapses
//     toggleCollapse() {
//         const collapsed = !this.state.collapsed;
//         this.setState({collapsed});
//
//     }
//
//     componentWillMount() {
//         console.log(this.props.username);
//         // this.setState({username: this.props.getUsername()})
//     }
//
//     render() {
//         const {location} = this.props;
//         const {collapsed} = this.state;
//         const loginClass = location.pathname === "/" ? "active" : "";
//         // const archivesClass = location.pathname.match(/^\/archives/) ? "active" : "";
//         // const settingsClass = location.pathname.match(/^\/settings/) ? "active" : "";
//         const navClass = collapsed ? "collapse" : "";
//
//
//         return (
//
//             <nav className="navbar navbar-default" role="navigation">
//                 <div className="container-fluid">
//
//                     <div className="navbar-header">
//                         <button type="button" className="navbar-toggle"
//                                 onClick={this.toggleCollapse.bind(this)} aria-expanded="false">
//                             <span className="sr-only">Toggle navigation</span>
//                             <span className="icon-bar"></span>
//                             <span className="icon-bar"></span>
//                             <span className="icon-bar"></span>
//                         </button>
//                         <a className="navbar-brand" href="/">
//                         <img alt="Showcase" className="showcase" src={require('../../../public/assets/ShowcaseLogoNav.png')}/></a>
//                     </div>
//
//
//                     <div çName={"navbar-collapse" + navClass} id="bs-example-navbar-collapse-1">
//
//                         <ul className="nav navbar-nav navbar-right">
//
//                             <a className="navbar-brand" href="#">
//                                 <img alt="profile-pic" src=""/></a>
//                             <p className="navbar-text">Welcome, {this.state.username} </p>
//
//                         </ul>
//                     </div>
//
//                 </div>
//
//             </nav>
//
//         );
//     }
// }
//
