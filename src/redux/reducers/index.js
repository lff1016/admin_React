import { combineReducers } from 'redux';

import loginState from './loginState';
import articles from './articles';
import drafts from './drafts';
import categories from './category';
import tags from './tags';
import poems from './poem';


export default combineReducers({
  loginState,
  articles,
  drafts,
  categories,
  tags,
  poems
})
