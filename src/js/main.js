var React = require('react');
var map = require('./components/googlemap.jsx');
//require('bootstrap');
import Location from './components/location.jsx';
import Weather from './components/weather.jsx';
import Home from './partials/home.jsx';
import Eat from './partials/eat.jsx';
import Bar from './partials/bar.jsx';

import Track from './partials/track.jsx';
import Router from 'react-router';
import datamodel from './services/model.js';
import FacebookLogin from './components/facebookLogin.jsx';


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
      <RouteHandler/>
    </div>
  }

}

var routes = (
  <Route handler={App} path="/">
    <Route name="eat" handler={Eat}/>
    <Route name="bar" handler={Bar}/>

    <Route name="track" handler={Track}/>

    <DefaultRoute handler={Home}/>
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
    geocoder.geocode(
      {'location': latlng}, ((result, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          if (result[0]) {
            var location = result[0].formatted_address;
            var apiLocation = getApiLocation(result);
            React.render(React.createElement(Location, {data: location}), document.getElementById('location'));
            React.render(React.createElement(Weather, {
              data: {
                latlng: latlng,
                location: location
              }
            }), document.getElementById('weather'));
            Router.run(routes, function (Handler) {
              React.render(<Handler/>, document.getElementById('routing'));
            });
          }
        }
      }));
    datamodel.latlng = latlng;

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



