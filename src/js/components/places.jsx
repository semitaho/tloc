import React from 'react';
import GoogleMap from '../components/googlemap.jsx';
import dataModel from '../services/model.js';
import dispatcher from '../services/tlocDispatcher.js';
import geoService from '../services/geoservice.js';
import ApiLoader from '../components/apiloader.jsx';
export default class Places extends React.Component {
  constructor() {
    super();
    this.state = {items: [], active: null, latlng: dataModel.getLocation()};
    this.onReady = this.onReady.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
  }

  componentDidMount() {
    dataModel.addListener('location-update', this.onLocationChange.bind(this));
  }

  onLocationChange() {
    console.log('places - change', dataModel.getLocation());
    this.setState({latlng: dataModel.getLocation()});
   // this.initItems();

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
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        this.setState({direction: result, active: event});
      }
    }.bind(this));

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

    }
    if (this.state.latlng !== undefined && this.state.latlng !== null) {
      console.log('lattari lng', this.state.latlng);

      return (
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <GoogleMap
                       onready={this.onReady}
                       direction={this.state.direction}/>
          </div>
          <div className="col-md-6 col-sm-12 desc">
            {items}
          </div>
        </div>

      )
    } else {
      return <ApiLoader name="Google maps" />
    }
  }


  initItems() {
    var latlng = dataModel.getLocation();
    if (latlng === undefined || latlng === null) {
      return;
    }
    console.log('initing items', this.map);
    var service = new google.maps.places.PlacesService(this.map);
    var request = {
      location: latlng,
      radius: '1500',
      types: [this.props.type]
    };
    service.nearbySearch(request, this.itemsFound.bind(this, latlng));
  }

  itemsFound(latlng, results) {
    console.log('items', results);
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

    this.fillDistances(itemsNearby, destinations, latlng);
  }

  fillDistances(itemsNearby, destinations, latlng) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [latlng],
      destinations: destinations,
      travelMode: google.maps.TravelMode.WALKING
    }, function (data) {
      this.onDistance(data, itemsNearby, latlng);
    }.bind(this));
  }

  onDistance(data, itemsNearby, latlng) {
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
    this.setState({items: itemsNearby, direction: null, latlng: latlng});
  }

}