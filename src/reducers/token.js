const initialState = {
  token: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token,
      };
    case 'CLEAR_TOKEN':
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
};

export default rootReducer;
