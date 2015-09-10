import React from 'react';
import $ from 'jquery';

export default class GoogleMap extends React.Component {
  constructor() {
    super();
    this.initGoogleMaps = this.initGoogleMaps.bind(this);
    this.restaurantsFound = this.restaurantsFound.bind(this);
    this.createMarker = this.createMarker.bind(this);
    this.onDistance = this.onDistance.bind(this);

    this.state = {restaurants: []};

  }

  handleClick(event) {
    if (this.currentMarker) {
      this.currentMarker.setMap(null);
    }

    this.currentMarker = this.createMarker(event.location, event.name, event.icon);
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
      }.bind(this)) }</div>

    }
    return (

      <div className="caption">
        <h1 className="text-center question">What do you want to do?</h1>

        <div className="row">
          <div className="col-md-6">
            <button type="button" className="btn btn-info btn-block">Go to eat</button>
          </div>

        </div>
        <div id="map"/>
        {restaurants}

      </div>
    )

  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.initGoogleMaps, this.onError, this.geoOptions);

    }

  }



  initGoogleMaps(data) {
    var latlng = this.parseLatLng(data);


    google.maps.event.trigger(this.map, "resize");
    this.createMarker(latlng, 'you');
    this.initRestaurants(latlng);

  }

  initRestaurants(latlng) {
    var service = new google.maps.places.PlacesService(this.map);
    var request = {
      location: latlng,
      radius: '1500',
      types: ['food']
    };
    service.nearbySearch(request, this.restaurantsFound);
  }

  restaurantsFound(results) {

    //
  }


}