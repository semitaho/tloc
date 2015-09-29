var React = require('react');
//require('bootstrap');
import Location from './components/location.jsx';
import Weather from './components/weather.jsx';

import Home from './partials/home.jsx';
var Eat = require('./partials/eat.jsx');
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

var Breadcrumbs = require('react-breadcrumbs');
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

class App extends React.Component {
  render() {
    return <div>
      <GAInitializer />

      <div className="row">
        <div className="col-md-12 breadcrumb">
          <Breadcrumbs />
          <hr />
        </div>
      </div>
      <RouteHandler/>
    </div>
  }

  componentDidMount() {
    ga('create', 'UA-68214703-1');
    ga('send', 'pageview');
    console.log('app initialized');

  }

}

var routes = (
  <Route handler={App} name="home" path="/">
    <Route name="eat" handler={Eat}/>
    <Route name="bar" handler={Bar}/>
    <Route name="bicycle" handler={Bicycle}/>

    <Route name="track" handler={Track}/>
    <Route name="car" handler={Car}/>

    <DefaultRoute name="" handler={Home}/>
  </Route>
);

var checkLogin = function () {
  if (window.location.hostname === 'localhost') {
    console.log('in localhost');

  }
  else {
    /*
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
     */
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
    React.render(React.createElement(Weather), document.getElementById('weather'));
    React.render(React.createElement(Location), document.getElementById('location'));

    console.log('lat', latlng);

    geoService.geocode(latlng, function (done) {
      dispatcher.dispatch({
        actionType: 'location-update',
        location: done.latlng,
        apiLocation: done.apiLocation,
        city: done.location
      });
      Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.getElementById('routing'));
      });


    });


  }, undefined, {enableHighAccuracy: true});
};


window.fbAsyncInit = function () {
  FB.init({
    appId: '928749127211404',
    xfbml: true,
    version: 'v2.4'
  });
  checkLogin();
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));



