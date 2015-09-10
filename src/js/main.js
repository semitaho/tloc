var React = require('react');
var map = require('./components/googlemap.jsx');
//require('bootstrap');
import Location from './components/location.jsx';
import Weather from './components/weather.jsx';
import Home from './partials/home.jsx';
import Eat from './partials/eat.jsx';
import Router from 'react-router';
import datamodel from './services/model.js';
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
    <DefaultRoute handler={Home}/>
  </Route>
);


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
          console.log('got api location: ' + apiLocation);
          console.log('real location: ' + location);
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


//
//React.render(React.createElement(map), document.getElementById('mapsinterests'));

