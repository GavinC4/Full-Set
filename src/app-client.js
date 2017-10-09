/* This is the component that renders the whole app. Includes:
* 1. The Routes from reactRoutes file
* 3. The ReactDom Rendering piece which renders it all to the web
*/

//import dependencies
import React from 'react';
import ReactDOM from 'react-dom';


//import components
import routes from '../reactRoutes';
const app = document.getElementById('app');

ReactDOM.render(routes, app);


