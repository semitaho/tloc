const initialState = {items: [], sortbyindex: 0};

export default function placesReducer(state = initialState, action) {
  if (action.type === 'RECEIVE_PLACES') {
    console.log('receiving places', action.places);
    return Object.assign({}, state, {items: action.places});
  }
  return state;

}