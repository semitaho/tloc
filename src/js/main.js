import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Router, IndexRoute, IndexRedirect, Route, Link, hashHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'
import geoService from './services/geoservice.js';
import locationReducer from './reducers/locationReducer.js';
import placesReducer from './reducers/placesReducer.js';
import mapReducer from './reducers/mapReducer.js';
import Eat from './partials/eat.jsx';
import Bar from './partials/bar.jsx';
import Interest from './partials/interest.jsx';
let Breadcrumbs = require('react-breadcrumbs');

import Home from './partials/home.jsx';


class App extends React.Component {
  render() {

    return <div>
      {/*
       <GAInitializer />
       */}
      <div className="row">
        <div className="col-md-12 breadcrumb">
          <Breadcrumbs routes={this.props.routes}/>
        </div>
      </div>
      {this.props.children}
    </div>
  }

  componentDidMount() {
    // ga('create', 'UA-68214703-1');
    // ga('send', 'pageview');
  }

}

/*
 let routes = (
 <Route history={history} handler={App} name="home" path="/">
 {/*
 <Route name="eat" handler={Eat}/>
 <Route name="bar" handler={Bar}/>
 <Route name="bicycle" handler={Bicycle}/>

 <Route name="track" handler={Track}/>
 <Route name="car" handler={Car}/>
 }
 <DefaultRoute name="" handler={Home}/>
 </Route>
 );
 */


const store = createStore(
  combineReducers({
    location: locationReducer,
    places: placesReducer,
    map: mapReducer,
    routing: routerReducer
  }),
  applyMiddleware(thunkMiddleware)
);

store.subscribe(() => {
  console.log('state', store.getState());

});

const history = syncHistoryWithStore(hashHistory, store);
geoService.getCurrentPosition()
  .then(latlng => {
    return geoService.geocode(latlng)
  })
  .then(data => {
    store.dispatch({type: 'RECEIVE_LOCATION', data});

  });
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" name="tloc" component={App}>
        <Route name="eat" path="eat" component={Eat}/>
        <Route name="bar" path="bar" component={Bar}/>
        <IndexRoute component={Home}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('routing')
);

/*
 import Bar from './partials/bar.jsx';

 import Bicycle from './partials/bicycle.jsx';
 import Car from './partials/car.jsx';
 import Track from './partials/track.jsx';
 import Router from 'react-router';
 import datamodel from './services/model.js';
 import FacebookLogin from './components/facebookLogin.jsx';
 import dispatcher from './services/tlocDispatcher.js';
 import geoService from './services/geoservice.js';
 import ga from 'react-google-analytics';

 var GAInitializer = ga.Initializer;
 var Route = Router.Route,
 DefaultRoute = Router.DefaultRoute,
 RouteHandler = Router.RouteHandler;

 var getApiLocation = function (results) {
 var apiLocation = '';
 results.forEach(result => {
 if (result.types.indexOf('locality') > -1) {
 apiLocation = result.formatted_address;
 }

 });
 return apiLocation;
 };




 var checkLogin = function () {
 if (window.location.hostname === 'localhost') {
 console.log('in localhost');

 }
 else {

 FB.getLoginStatus(function (response) {
 console.log('response', response);
 if (response.status === 'connected') {
 console.log('Logged in.');
 console.log('response', response);
 FB.api('/me', function (response) {
 console.log('Successful login for: ' + response.name);
 datamodel.me = response;
 console.log('me', response);
 });
 initApp();
 }
 else {

 FB.login(function (response) {
 if (response.status === 'connected') {
 initApp();
 }
 });
 }
 });

 }
 initApp();

 };

 var initApp = function () {
 navigator.geolocation.getCurrentPosition(location => {
 var geocoder = new google.maps.Geocoder;
 var latlng = {
 lat: location.coords.latitude,
 lng: location.coords.longitude
 };
 React.render(React.createElement(Location), document.getElementById('location'));

 console.log('lat', latlng);

 geoService.geocode(latlng, function (done) {
 dispatcher.dispatch({
 actionType: 'location-update',
 location: done.latlng,
 apiLocation: done.apiLocation,
 city: done.location
 });

 });


 }, undefined, {enableHighAccuracy: true});
 };



 */
