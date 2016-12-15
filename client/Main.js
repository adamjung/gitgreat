//Renders the HomepageApp component on homepage.html
import React from 'react';
import ReactDOM from 'react-dom';
import HomepageApp from './Components/HomepageApp.jsx';
import CreateEventApp from './Components/CreateEventApp.jsx';
import WhatToBring from './Components/WhatToBring.jsx';
import Reminders from './Components/Reminders.jsx';
import FeatureNavigation from './Components/FeatureNavigation.jsx';
import Details from './Components/Details Page/Details.jsx'
import Transportation from './Components/Transportation Page/Transportation.jsx'
import { Router, Route, hashHistory } from 'react-router';



ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={HomepageApp}/>
      <Route path="/create" component={CreateEventApp}/>
      <Route path="/home" component={Details}/>
      <Route path="/wtb" component={WhatToBring}/>
      <Route path="/reminders" component={Reminders}/>
      <Route path="/transportation" component={Transportation}/>
      <Route path="/featnav" component={FeatureNavigation}/>
  </Router>
),document.getElementById('app'))


