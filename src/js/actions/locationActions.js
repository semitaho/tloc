import geoService from './../services/geoservice.js';


export function receiveLocationData(newLocation) {
  return dispatch => {
    return geoService.geocode(newLocation)
      .then(data => {
        dispatch({type: 'RECEIVE_LOCATION', data});

      });
  };
}

