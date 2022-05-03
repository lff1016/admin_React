import {createStore} from 'redux';
import allReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension'


const store = process.env.NODE_ENV === 'development' ? createStore(allReducer, composeWithDevTools()) : createStore(allReducer)

export default store