
import React from 'react';

import { Router, Route, IndexRoute, browserHistory, hashHistory} from 'react-router';

//import components
// import Counter from './Counter';

import Dashboard from './src/components/children/Dashboard';
import GeneratePlaylist from './src/components/children/GeneratePlaylist';
import Layout from './src/components/Layout';
import Login from './src/components/children/Login';
import SavePlaylist from './src/components/children/SavePlaylist';

// browserHistory.push

const routes = (
    <Router history={hashHistory}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Login}></IndexRoute>
            <Route path="/dashboard/:username" component={Dashboard}></Route>
            <Route path="/generateplaylist" component={GeneratePlaylist}></Route>
            <Route path="/saveplaylist" component={SavePlaylist}></Route>

        </Route>
    </Router>
);

export  default routes;


