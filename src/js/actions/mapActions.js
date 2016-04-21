export function fetchDirection(restaurant) {
  return (dispatch, getState) => {
    let start = getState().location.latlng;
    dispatch(receiveDirection(start, restaurant.location))
  }
}

export function receiveMap(map) {
  console.log('map', map);
  return {
    type: 'RECEIVE_MAP',
    map
  }
}

function receiveDirection(start, end) {
  console.log('receive direction');
  return {
    type: 'RECEIVE_DIRECTION',
    direction: {
      start, end
    }
  };
}