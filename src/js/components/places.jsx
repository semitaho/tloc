import React from 'react';
import ApiLoader from '../components/apiloader.jsx';
import $ from 'jquery';
class Places extends React.Component {
  constructor() {
    super();
  }


  onSort(criteria) {
    this.props.toggleDropdown(false);
    let sortBy = criteria.sortbyindex;
    this.props.onSort(sortBy);
    //  var stateObject = $.extend(criteria, {dropdown: false});
    //  this.setState(stateObject);
  }

  sortBy() {
    var baseSortBy = {dropdown: false};
    let sorteditems = this.props.items.slice();
    switch (this.props.sortbyindex) {
      case 0:
        sorteditems = this.sortByDefault(sorteditems);
        break;
      case 1:
        sorteditems = this.sortByDistance(sorteditems);
        break;
      case 2:
        sorteditems = this.sortByName(sorteditems);
        break;
      case 3:
        sorteditems = this.sortByReview(sorteditems);
        break;
    }
    return sorteditems;


  }

  sortByDefault(items) {
    items.sort(function (a, b) {
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
    return items;

  }

  sortByName(items) {
    items.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    return items;

  }

  sortByDistance(items) {
    items.sort(function (a, b) {
      return a.distance.value - b.distance.value;
    });
    return items;

  }

  sortByReview(items) {
    items.sort(function (a, b) {
      if (a.rating === undefined) {
        return 1;
      }
      if (b.rating === undefined) {
        return -1;
      }
      return b.rating - a.rating;
    });
    return items;
  }


  render() {
    let sortedItems = this.sortBy(this.props.items);
    var dropdownClass = "dropdown text-right";
    if (this.props.dropdown) {
      dropdownClass = 'dropdown open text-right';
    }

    var items = <div className="list-group place">

      <div className={dropdownClass}>
        <button className="btn btn-default dropdown-toggle" aria-haspopup="true" aria-expanded="false" type="button"
                onClick={()=> this.props.toggleDropdown(!this.props.dropdown)}>
          {this.props.sortbytext} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu dropdown-menu-right">
          {this.props.sort.map(criteria => {
            return <li><a onClick={this.onSort.bind(this,criteria)}>{criteria.sortbytext}</a></li>

          })}
        </ul>
      </div>
      {sortedItems.map((restaurant, index) => {
        var listClass = 'list-group-item';
        if (this.props.active === restaurant) {
          listClass += ' active';
        }
        var stars = '';
        if (restaurant.rating) {
          var pointStr = restaurant.rating.toString() + ' / 5';
          stars = <small className="pull-right">{pointStr}</small>;
        }

        var details = this.renderDetails(restaurant);
        let restaurantMapped = <a className={listClass} onClick={() => this.props.onItemClick(restaurant, index)}>
          <h4 className="list-group-item-heading">{restaurant.name} {stars}</h4>
          <h5>{restaurant.vicinity}</h5>

          <p className="list-group-item-text">Distance: {restaurant.distance.text}</p>

          <p className="list-group-item-text">Duration: {restaurant.duration.text}</p>
          <b className="list-group-item-text">{restaurant.isopen}</b>
          {details}

        </a>;
        return restaurantMapped;
      })}</div>
    return items;


  }

  formatTime(timestamp) {
    return new Date(timestamp * 1000).toUTCString();
  }


  renderDetails(restaurant, details) {

    var self = this;
    if (restaurant.showdetails) {
      return <div className="show-details">
        {
          restaurant.details.website !== undefined ?
            <div className="list-group-item-text">Home page: <a target="_blank"
                                                                href={restaurant.details.website}>{restaurant.details.website}</a>
            </div> : ''
        }
        {
          restaurant.details.international_phone_number !== undefined ?
            <div className="list-group-item-text">Phone: {restaurant.details.international_phone_number}</div> : ''
        }
        {restaurant.details.reviews !== undefined && restaurant.details.reviews !== null ?

          <div className="list-group-item-text">
            {restaurant.details.reviews.map(review => {
              if (review.text === '' || review.text === null) {
                return '';
              }

              return <blockquote>
                <small><em>"{review.text}" </em> - {review.author_name} {self.formatTime(review.time)} </small>
              </blockquote>

            })}</div> : ''}


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
      types: this.props.type
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
        showdetails: false,
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
  sort: [{sortbyindex: 0, sortbytext: 'default'}, {sortbyindex: 1, sortbytext: 'by distance'}, {
    sortbyindex: 2,
    sortbytext: 'by name'
  }, {
    sortbyindex: 3,
    sortbytext: 'by rating'
  }

  ]
};
export default Places;