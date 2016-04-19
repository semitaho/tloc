export function searchPlaces(map, types) {
  console.log('search places', map);
  return (dispatch, getState) => {
    let location = getState().location.latlng;
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
        return dispatch({
          type: 'RECEIVE_PLACES',
          places: results
        });

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
    //  console.log(result.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}));
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