export function fetchDirection(restaurant) {
  return (dispatch, getState) => {
    let start = getState().location.latlng;
    dispatch(receiveDirection(start, restaurant.location))
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