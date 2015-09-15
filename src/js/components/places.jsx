import React from 'react';
import GoogleMap from '../components/googlemap.jsx';
import dataModel from '../services/model.js';

export default class Places extends React.Component {
  constructor() {
    super();
    this.state = {items: [], active: null};
    this.onReady = this.onReady.bind(this);
  }

  componentDidMount() {
    this.initItems();
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
        this.setState({direction: result, active: event});
      }
    }.bind(this));

  }

  centerChanged(event) {
    if (event.latLng) {
      var latLng = {lat: event.latLng.G, lng: event.latLng.K};
      dataModel.latlng = latLng;
      this.initItems();
    }
  }


  onReady(map) {
    console.log('map loaded');
    this.map = map;

  }


  render() {
    var items = '';
    if (this.state.items) {
      items = <div className="list-group">{this.state.items.map(function (restaurant) {
        var listClass = 'list-group-item';
        if (this.state.active === restaurant) {
          listClass += ' active';
        }
        return (<a className={listClass} onClick={this.handleClick.bind(this,restaurant)}>
          <h4 className="list-group-item-heading">{restaurant.name}</h4>
          <h5>{restaurant.vicinity}</h5>

          <p className="list-group-item-text">Distance: {restaurant.distance.text}</p>

          <p className="list-group-item-text">Duration: {restaurant.duration.text}</p>
          <b className="list-group-item-text">{restaurant.isopen}</b>


        </a>)
      }.bind(this))}</div>

    }


    return (
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <GoogleMap marker={{latlng:this.state.latlng, icon: this.state.icon, label: this.state.label}}
                     onready={this.onReady} centerChanged={this.centerChanged.bind(this)}
                     direction={this.state.direction}/>
        </div>
        <div className="col-md-6 col-sm-12 desc">
          {items}
        </div>
      </div>)

  }


  initItems() {
    var service = new google.maps.places.PlacesService(this.map);
    var request = {
      location: dataModel.latlng,
      radius: '1500',
      types: [this.props.type]
    };
    service.nearbySearch(request, this.itemsFound.bind(this));
  }

  itemsFound(results) {
    console.log('items', results);
    var itemsNearby = results.map(function (result) {
      var isOpen = '';
      if (result.opening_hours) {
        isOpen = result.opening_hours.open_now ? 'Open' : 'Closed';
      }
      return {
        name: result.name,
        vicinity: result.vicinity,
        isopen: isOpen,
        icon: result.icon,
        location: {lat: result.geometry.location.G, lng: result.geometry.location.K}
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
      origins: [dataModel.latlng],
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
        return 1;
      }

      return a.distance.value - b.distance.value;
    });
    this.setState({items: itemsNearby, direction: null});
  }

}