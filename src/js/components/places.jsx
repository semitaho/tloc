import React from 'react';
import GoogleMap from '../components/googlemap.jsx';
import dataModel from '../services/model.js';
import dispatcher from '../services/tlocDispatcher.js';
import geoService from '../services/geoservice.js';
import ApiLoader from '../components/apiloader.jsx';
import mapStore from '../services/mapstore.js'
import $ from 'jquery';
class Places extends React.Component {
  constructor() {
    super();


    this.state = {items: [], active: null, details: null, dropdown: false, sortbyindex: 0, sortbytext: 'Sort by'};
    this.fetchDetails.bind(this);
    mapStore.addListener('map-created', this.mapCreated.bind(this));
    dataModel.addListener('location-updated', this.locationUpdated.bind(this));

  }

  componentDidMount() {

  }

  mapCreated() {
    console.log('map has been created');
    this.initItems();
  }

  locationUpdated() {
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
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        dispatcher.dispatch({
          actionType: 'direction-update',
          direction: result
        });
      }
    }.bind(this));

    this.fetchDetails(event.placeid);
  }

  fetchDetails(id) {
    var self = this;
    var service = new google.maps.places.PlacesService(mapStore.getMap());
    service.getDetails({
      placeId: id
    }, function (place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var newDetails = $.extend(place, {showreviews: false});
        self.setState({details: newDetails});
      }
    });

  }

  toggleDropdown() {
    var dropdown = this.state.dropdown;
    this.setState({dropdown: !dropdown});

  }

  onSort(criteria) {
    var stateObject = $.extend(criteria, {dropdown: false});
    this.setState(stateObject);
  }

  sortBy() {
    var baseSortBy = {dropdown: false};
    var sorteditems = this.state.items;

    switch (this.state.sortbyindex) {
      case 0:
        sorteditems = this.sortByDefault();
        break;
      case 1:
        sorteditems = this.sortByDistance();
        break;
      case 2:
        sorteditems = this.sortByDuration();
        break;
      case 3:
        sorteditems = this.sortByReview();
        break;
    }
    return sorteditems;


  }

  sortByDefault() {
    this.state.items.sort(function (a, b) {
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
    return this.state.items;

  }

  sortByDuration() {
    this.state.items.sort(function (a, b) {
      return a.duration.value - b.duration.value;
    });
    return this.state.items;

  }

  sortByDistance() {
    this.state.items.sort(function (a, b) {
      return a.distance.value - b.distance.value;
    });
    return this.state.items;

  }

  sortByReview() {
    this.state.items.sort(function (a, b) {
      if (a.rating === undefined) {
        return 1;
      }
      if (b.rating === undefined) {
        return -1;
      }
      return b.rating - a.rating;
    });
    return this.state.items;
  }


  render() {
    if (this.state.items) {
      var sortedItems = this.sortBy(this.state.items);
      var dropdownClass = "dropdown text-right";
      if (this.state.dropdown) {
        dropdownClass = 'dropdown open text-right';
      }

      var items = <div className="list-group">
        <div className={dropdownClass}>
          <button className="btn btn-default dropdown-toggle" aria-haspopup="true" aria-expanded="false" type="button"
                  onClick={this.toggleDropdown.bind(this)}>
            {this.state.sortbytext} <span className="caret"></span>
          </button>
          <ul className="dropdown-menu dropdown-menu-right">
            {this.props.sort.map(criteria => {
              return <li><a onClick={this.onSort.bind(this,criteria)}>{criteria.sortbytext}</a></li>

            })}
          </ul>
        </div>
        {sortedItems.map(function (restaurant) {
          var listClass = 'list-group-item';
          if (this.state.active === restaurant) {
            listClass += ' active';
          }
          var stars = '';
          if (restaurant.rating) {
            var pointStr = restaurant.rating.toString() + ' / 5';
            stars = <small className="pull-right">{pointStr}</small>;
          }

          var details = this.renderDetails(restaurant, this.state.details);
          var restaurant = <a className={listClass} onClick={this.handleClick.bind(this,restaurant)}>
            <h4 className="list-group-item-heading">{restaurant.name} {stars}</h4>
            <h5>{restaurant.vicinity}</h5>

            <p className="list-group-item-text">Distance: {restaurant.distance.text}</p>

            <p className="list-group-item-text">Duration: {restaurant.duration.text}</p>
            <b className="list-group-item-text">{restaurant.isopen}</b>
            {details}

          </a>;
          return restaurant;
        }.bind(this))}</div>
      return items;

    } else {
      return <ApiLoader name="Places"/>
    }
  }

  renderDetails(restaurant, details) {
    if (details === undefined || details === null) {
      return '';
    }
    if (restaurant.placeid === details.place_id) {
      console.log(details);
      if (details.reviews === undefined || details.reviews === null) {
        return '';
      }

      return <div className="panel panel-primary show-details">
        <div className="panel-heading">Details</div>
        {details.reviews !== undefined && details.reviews !== null ?

        <div className="list-group-item">
          {details.reviews.map(review => {
            if (review.text === '' || review.text === null) {
              return '';
            }

            return <blockquote>
              <small><em>"{review.text}" </em> - {review.author_name}</small>
            </blockquote>

          })}</div> : ''}
        {
          details.website !== undefined ?
            <div className="list-group-item"><strong>Home page:</strong> <a target="_blank"
                                                                            href={details.website}>{details.website}</a>
            </div> : ''
        }
        {
          details.international_phone_number !== undefined ?
            <div className="list-group-item"><strong>Phone:</strong> {details.international_phone_number}</div> : ''
        }


      </div>
    }
    return '';

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
      //  if (result.photos)
      //  console.log(result.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}));
      return {
        placeid: result.place_id,
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

    this.setState({items: itemsNearby, direction: null});
  }

}

Places.defaultProps = {
  sort: [{sortbyindex: 0, sortbytext: 'Default'}, {sortbyindex: 1, sortbytext: 'by distance'}, {
    sortbyindex: 2,
    sortbytext: 'by duration'
  }, {
    sortbyindex: 3,
    sortbytext: 'by rating'
  }

  ]
};
export default Places;