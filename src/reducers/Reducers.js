// src/reducers.js
import { combineReducers } from 'redux';

// Sample reducer - replace this with your actual reducer logic
const someReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SAMPLE_ACTION':
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

// Combine reducers if you have multiple
const rootReducer = combineReducers({
  someReducer,
  // Add other reducers here if needed
});

export default rootReducer;
