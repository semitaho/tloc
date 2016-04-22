const initialState = {items: [], sortbyindex: 0};

export default function placesReducer(state = initialState, action) {
  if (action.type === 'RECEIVE_PLACES') {
    console.log('receiving places', action.places);
    return Object.assign({}, state, {items: action.places});
  }
  if (action.type === 'TOGGLE_DETAILS') {
    let items = state.items;
    let item = state.items[action.index];
    let newItems = [...items.slice(0, action.index),
      Object.assign({}, item, {
        details: action.details,
        showdetails: action.details !== null
      }), ...items.slice(action.index + 1)];
    let newState = Object.assign({}, state, {
      items: newItems
    });
    return newState;
  }
  return state;

}