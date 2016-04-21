let initialState = {};
export default function mapReducer(state = initialState, action) {
  if (action.type === 'RECEIVE_DIRECTION') {
    return Object.assign({}, state, {direction: action.direction});
  }
  if (action.type === 'RECEIVE_MAP') {
    console.log('RECEIVING MAP');
    return Object.assign({}, state, {map: action.map});

  }
  return state;
}