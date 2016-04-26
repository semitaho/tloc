export function fetchDirection(restaurant) {
  return (dispatch, getState) => {
    let start = getState().location.latlng;
    dispatch(receiveDirection(start, restaurant.location))
  }
}

export function receiveMap(map) {
  return {
    type: 'RECEIVE_MAP',
    map
  }
}

export function receiveLocation(location) {
  return {
    type: 'RECEIVE_LOCATION',
    location

  };

}

export function receiveDirection(start=null, end=null) {
  console.log('receive direction', start);
  return {
    type: 'RECEIVE_DIRECTION',
    direction: {
      start, end
    }
  };
}