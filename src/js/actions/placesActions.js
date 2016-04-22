export function fetchDetails(place) {
  return (dispatch, getState) => {
    let state = getState();
    let newPlace = Object.assign({}, place, {
      showdetails: !place.showdetails
    });
    let items = state.places.items;
    var self = this;
    var service = new google.maps.places.PlacesService(state.map.map);
    let index = items.findIndex((item) => item.placeid === newPlace.placeid);

    if (newPlace.showdetails) {

      service.getDetails({
        placeId: newPlace.placeid
      }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          dispatch(receiveDetails(details, index));
        }
      });
    } else {
      dispatch(receiveDetails(null, index));
    }
  };
}

function receiveDetails(details, index) {
  return {
    type: 'TOGGLE_DETAILS',
    index,
    details
  }
}

export function toggleDropdown(value) {
  return {
    type: 'TOGGLE_DROPDOWN',
    value
  };
}

export function receiveSortByIndex(index){
  return {
    type: 'RECEIVE_SORTBY_INDEX',
    index
  };
}

export function searchPlaces(types) {
  return (dispatch, getState) => {
    let location = getState().location.latlng;
    let map = getState().map.map;
    var service = new google.maps.places.PlacesService(map);
    var request = {
      location,
      radius: '1500',
      types
    };
    return new Promise(resolve => {
      service.nearbySearch(request, (data) => {
        resolve(data);
      });
    }).then(itemsFound)
      .then(items => {
        return fillDistances(items, location);
      }).then(data => {
        return onDistance(data);
      }).then(results => {
        dispatch({
          type: 'RECEIVE_PLACES',
          places: results
        });
        return Promise.resolve()

      });
  };
}

function itemsFound(results) {
  var itemsNearby = results.map(result => {
    var isOpen = '';
    if (result.opening_hours) {
      isOpen = result.opening_hours.open_now ? 'Open' : 'Closed';
    }
    //  if (result.photos)
    return {
      placeid: result.place_id,
      name: result.name,
      vicinity: result.vicinity,
      isopen: isOpen,
      showdetails: false,
      icon: result.icon,
      rating: result.rating,
      location: {lat: result.geometry.location.lat(), lng: result.geometry.location.lng()}
    };
  });
  var destinations = [];
  itemsNearby.forEach((item) => {
    destinations.push(new google.maps.LatLng(item.location.lat, item.location.lng));
  });
  return {itemsNearby, destinations};
}

function fillDistances(itemsDestinations, location) {
  let service = new google.maps.DistanceMatrixService();
  let origins = [location];
  let destinations = itemsDestinations.destinations.map(item => {
    return {lat: item.lat(), lng: item.lng()}
  });

  return new Promise(resolve => {
    service.getDistanceMatrix({
      origins,
      destinations,
      travelMode: google.maps.TravelMode.WALKING
    }, data => {
      resolve({data, itemsDestinations});
    });
  });
}

function onDistance(data) {
  data.itemsDestinations.itemsNearby.forEach((restaurant, index) => {
    var element = data.data.rows[0].elements[index];
    restaurant.distance = element.distance;
    restaurant.duration = element.duration;

  });
  return data.itemsDestinations.itemsNearby;
}