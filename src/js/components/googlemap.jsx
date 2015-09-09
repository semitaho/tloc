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


  parseLatLng(data) {
    return {lat: data.coords.latitude, lng: data.coords.longitude};

  }

  createMarker(latlng, label, color) {
    var infowindow = new google.maps.InfoWindow({
      content: '<h1>' + label + '</h1>'
    });
    var marker = new google.maps.Marker({position: latlng, map: this.map, title: 'jaa'});
    if (color !== undefined) {
      marker.setIcon(color);

    }
    return marker;

  }


  initGoogleMaps(data) {
    var latlng = this.parseLatLng(data);
    this.origin = new google.maps.LatLng(latlng.lat, latlng.lng);
    console.log('on goog', latlng);
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: latlng,
      zoom: 14,
      linksControl: false,
      scrollwheel: false,
      zoomControl: false
    });

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
    console.log('restaurants', results);

    var restaurantsNearby = results.map(function (result) {
      return {
        name: result.name,
        vicinity: result.vicinity,
        icon: result.icon,
        location: {lat: result.geometry.location.G, lng: result.geometry.location.K}
      };
    });

    var createMarker = this.createMarker;
    var destinations = [];
    restaurantsNearby.forEach(function (restaurant) {

      destinations.push(new google.maps.LatLng(restaurant.location.lat, restaurant.location.lng));
    });

    this.fillDistances(restaurantsNearby, destinations);
    //
  }

  fillDistances(restaurantsNearby, destinations) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [this.origin],
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