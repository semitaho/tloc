let initialState = {};
export default function mapReducer(state = initialState, action) {
  if (action.type === 'RECEIVE_DIRECTION') {
    return Object.assign({}, state, {direction: action.direction});
  }
  return state;
}