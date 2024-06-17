// actions.js

// Action types
export const SET_TOKENS = 'SET_TOKENS';
export const CLEAR_TOKENS = 'CLEAR_TOKENS';

// Action creators
export const setToken = (accessToken, refreshToken) => {
  return {
    type: SET_TOKENS,
    payload: {
      accessToken,
      refreshToken,
    },
  };
};

export const clearToken = () => {
  return {
    type: CLEAR_TOKENS,
  };
};
