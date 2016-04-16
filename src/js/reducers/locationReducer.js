const initialState = {};

export default function locationReducer(state = initialState, action) {
  if (action.type === 'RECEIVE_LOCATION') {
    return action.data;
  }
  return state;

}
