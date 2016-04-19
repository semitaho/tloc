const initialState = [];

export default function placesReducer(state = initialState, action) {
  if (action.type === 'RECEIVE_PLACES') {
    console.log('receiving places', action.places);
    return action.places;
  }
  return state;

}