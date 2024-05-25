// store.js
import { createStore } from 'redux';
import rootReducer from './reducers/token'; // Create this file next

const store = createStore(rootReducer);

export default store;
