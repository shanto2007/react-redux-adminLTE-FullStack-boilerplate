import { combineReducers, createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import * as reducers from 'reducers/reducers'

const configureStore = (initialState = {}) => {
  const reducer = combineReducers({
    ...reducers,
  });
  let store;
  if (process.env.NODE_ENV === 'production') {
    store = createStore(
      reducer,
      initialState,
      compose(
        applyMiddleware(thunk)
      )
    );
    return store;
  }
  store = createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  return store;
}

export default configureStore;
