import React from 'react';
import GoogleMap from '../components/googlemap.jsx';
import dataModel from '../services/model.js';
import dispatcher from '../services/tlocDispatcher.js';
import geoService from '../services/geoservice.js';
import ApiLoader from '../components/apiloader.jsx';
import mapStore from '../services/mapstore.js'
export default class Places extends React.Component {
  constructor() {
    super();
    this.state = {items: [], active: null};
    mapStore.addListener('map-created', this.mapCreated.bind(this));
    dataModel.addListener('location-updated', this.locationUpdated.bind(this));

  }

  componentDidMount() {

  }

  mapCreated() {
    console.log('map has been created');
    this.initItems();
  }

  locationUpdated(){
    console.log('places - location updated');
    this.initItems();
  }

  handleClick(event) {
    var latlng = dataModel.getLocation();

    var start = new google.maps.LatLng(latlng.lat, latlng.lng);
    var end = new google.maps.LatLng(event.location.lat, event.location.lng);
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.WALKING
    };
    console.log('joujou');
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        dispatcher.dispatch({
          actionType: 'direction-update',
          direction: result
        });
      }
    }.bind(this));

  }

  render() {
    if (this.state.items) {
      var items = <div className="list-group">{this.state.items.map(function (restaurant) {
        var listClass = 'list-group-item';
        if (this.state.active === restaurant) {
          listClass += ' active';
        }
        var stars = '';
        if (restaurant.rating) {
          var pointStr = restaurant.rating.toString() + ' / 5';
          stars = <small className="pull-right">{pointStr}</small>;
        }
        var restaurant = <a className={listClass} onClick={this.handleClick.bind(this,restaurant)}>
          <h4 className="list-group-item-heading">{restaurant.name} {stars}</h4>
          <h5>{restaurant.vicinity}</h5>

          <p className="list-group-item-text">Distance: {restaurant.distance.text}</p>

          <p className="list-group-item-text">Duration: {restaurant.duration.text}</p>
          <b className="list-group-item-text">{restaurant.isopen}</b>
        </a>;
        return restaurant;
      }.bind(this))}</div>
      return items;

    } else {
      return <ApiLoader name="Places"/>
    }
  }


  initItems() {
    var latlng = dataModel.getLocation();
    if (latlng === undefined || latlng === null) {
      return;
    }
    var service = new google.maps.places.PlacesService(mapStore.getMap());
    var request = {
      location: latlng,
      radius: '1500',
      types: [this.props.type]
    };
    service.nearbySearch(request, this.itemsFound.bind(this));
  }

  itemsFound(results) {
    var itemsNearby = results.map(function (result) {
      var isOpen = '';
      if (result.opening_hours) {
        isOpen = result.opening_hours.open_now ? 'Open' : 'Closed';
      }
      if (result.photos)
        console.log(result.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}));
      return {
        name: result.name,
        vicinity: result.vicinity,
        isopen: isOpen,
        icon: result.icon,
        rating: result.rating,
        location: {lat: result.geometry.location.H, lng: result.geometry.location.L}
      };
    });

    var destinations = [];
    itemsNearby.forEach((item) => {
      destinations.push(new google.maps.LatLng(item.location.lat, item.location.lng));
    });

    this.fillDistances(itemsNearby, destinations);
  }

  fillDistances(itemsNearby, destinations) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [dataModel.getLocation()],
      destinations: destinations,
      travelMode: google.maps.TravelMode.WALKING
    }, function (data) {
      this.onDistance(data, itemsNearby);
    }.bind(this));
  }

  onDistance(data, itemsNearby) {
    itemsNearby.forEach((restaurant, index) => {
      var element = data.rows[0].elements[index];
      restaurant.distance = element.distance;
      restaurant.duration = element.duration;

    });

    itemsNearby.sort((a, b) => {
      if (a.isopen !== b.isopen) {
        if (a.isopen === 'Open') {
          return -1;
        }
        if (b.isopen === 'Open') {
          return 1;
        }
        if (a.isopen === '') {
          return -1;
        }
        if (b.isopen === '') {
          return 1;
        }
      }

      return a.distance.value - b.distance.value;
    });
    this.setState({items: itemsNearby, direction: null});
  }

}