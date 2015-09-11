import React from 'react';
import $ from 'jquery';
import dataModel from '../services/model.js';
import GoogleMap from '../components/googlemap.jsx';
var ReactComponent = React.Component;

export default class Eat extends ReactComponent {


  constructor() {
    super();
    this.createMarker = this.createMarker.bind(this);
    this.state = {label: 'You', latlng: dataModel.latlng, icon: null, restaurants: []};
    this.onReady = this.onReady.bind(this);
  }

  handleClick(event) {
    this.setState({latlng: event.location, icon: event.icon, label: event.name});
  }



  render() {
    var restaurants = '';
    if (this.state.restaurants) {
      restaurants = <div className="list-group">{this.state.restaurants.map(function (restaurant) {
        return (<a className="list-group-item" onMouseOver={this.handleClick.bind(this,restaurant)}>
          <h4 className="list-group-item-heading">{restaurant.name}</h4>
          <h5>{restaurant.vicinity}</h5>

          <p className="list-group-item-text">Distance: {restaurant.distance.text}</p>

          <p className="list-group-item-text">Duration: {restaurant.duration.text}</p>

        </a>)
      }.bind(this))}</div>

    }


    return <div> <div className="page-header"><h1 className="text-center answer">Go to for a eat</h1></div>
      <GoogleMap marker={{latlng:this.state.latlng, icon: this.state.icon, label: this.state.label}}
                 onready={this.onReady}/>
      {restaurants}
    </div>
  }

  componentDidMount() {


    //  this.createMarker(dataModel.latlng, 'You');
    this.initRestaurants(this.state.latlng);


  }

  onReady(map) {
    console.log('map loaded');
    this.map = map;

  }

  createMarker(latlng, label, color) {
    var infowindow = new google.maps.InfoWindow({
      content: '<h1>' + label + '</h1>'
    });
    var marker = new MarkerWithLabel({
      position: latlng, map: this.map,
      labelAnchor: new google.maps.Point(15, 0),
      labelContent: '<b>' + label + '</b>'
    });
    if (color !== undefined) {
      marker.setIcon(color);

    }
    return marker;
  }


  initRestaurants(latlng) {
    var service = new google.maps.places.PlacesService(this.map);
    var request = {
      location: latlng,
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
      origins: [this.state.latlng],
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

    console.log('distances', restaurantsNearby);
    restaurantsNearby.sort((a, b) => {
      return a.distance.value - b.distance.value;
    });
    this.setState({restaurants: restaurantsNearby});

  }


}