const initialState = {items: [], sortbyindex: 0, dropdown: false};

export default function placesReducer(state = initialState, action) {
  if (action.type === 'RECEIVE_PLACES') {
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
  if (action.type === 'TOGGLE_DROPDOWN') {
    console.log('toggle dropdown', action.value);
    let newState = Object.assign({}, state, {
      dropdown: action.value
    });
    return newState;
  }
  if (action.type === 'RECEIVE_SORTBY_INDEX') {
    let newState = Object.assign({}, state, {
      sortbyindex: action.index
    });
    return newState;
  }
  return state;

}