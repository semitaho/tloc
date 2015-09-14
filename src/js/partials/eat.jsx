import React from 'react';
import $ from 'jquery';
import dataModel from '../services/model.js';
import GoogleMap from '../components/googlemap.jsx';
var ReactComponent = React.Component;

export default class Eat extends ReactComponent {


  constructor() {
    super();
    this.state = {restaurants: []};
    this.onReady = this.onReady.bind(this);
  }

  handleClick(event) {

    var start = new google.maps.LatLng(dataModel.latlng.lat, dataModel.latlng.lng);
    var end = new google.maps.LatLng(event.location.lat, event.location.lng);
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.WALKING
    };
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        console.log('result', result);
        this.setState({latlng: event.location, icon: event.icon, label: event.name, direction: result});

      }
    }.bind(this));

  }

  handleMouseOut(event) {
    this.setState({latlng: null, icon: null, label: null});

  }


  render() {
    var restaurants = '';
    if (this.state.restaurants) {
      restaurants = <div className="list-group">{this.state.restaurants.map(function (restaurant) {
        return (<a className="list-group-item" onMouseOver={this.handleClick.bind(this,restaurant)}
                   onMouseOut={this.handleMouseOut.bind(this)}>
          <h4 className="list-group-item-heading">{restaurant.name}</h4>
          <h5>{restaurant.vicinity}</h5>

          <p className="list-group-item-text">Distance: {restaurant.distance.text}</p>

          <p className="list-group-item-text">Duration: {restaurant.duration.text}</p>

        </a>)
      }.bind(this))}</div>

    }


    return <div>
      <div className="page-header"><h1 className="text-center answer">Go to for a eat</h1></div>
      <GoogleMap marker={{latlng:this.state.latlng, icon: this.state.icon, label: this.state.label}}
                 onready={this.onReady} centerChanged={this.centerChanged.bind(this)} direction={this.state.direction}/>
      {restaurants}
    </div>
  }

  componentDidMount() {
    this.initRestaurants();
  }


  centerChanged(event) {
    var latLng = {lat: event.latLng.G, lng: event.latLng.K};
    dataModel.latlng = latLng;
    this.initRestaurants();
  }

  onReady(map) {
    console.log('map loaded');
    this.map = map;

  }

  initRestaurants() {
    var service = new google.maps.places.PlacesService(this.map);
    var request = {
      location: dataModel.latlng,
      radius: '1500',
      types: ['food']
    };
    service.nearbySearch(request, this.restaurantsFound.bind(this));
  }

  restaurantsFound(results) {
    var restaurantsNearby = results.map(function (result) {
      return {
        name: result.name,
        vicinity: result.vicinity,
        icon: result.icon,
        location: {lat: result.geometry.location.G, lng: result.geometry.location.K}
      };
    });

    var destinations = [];
    restaurantsNearby.forEach((restaurant) => {
      destinations.push(new google.maps.LatLng(restaurant.location.lat, restaurant.location.lng));
    });

    this.fillDistances(restaurantsNearby, destinations);
  }

  fillDistances(restaurantsNearby, destinations) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [dataModel.latlng],
      destinations: destinations,
      travelMode: google.maps.TravelMode.WALKING
    }, function (data) {
      this.onDistance(data, restaurantsNearby);
    }.bind(this));
  }

  onDistance(data, restaurantsNearby) {
    restaurantsNearby.forEach((restaurant, index) => {
      var element = data.rows[0].elements[index];
      restaurant.distance = element.distance;
      restaurant.duration = element.duration;

    });

    restaurantsNearby.sort((a, b) => {
      return a.distance.value - b.distance.value;
    });
    this.setState({restaurants: restaurantsNearby});

  }


}