import React from 'react'
import { render } from 'react-dom'
import Toastr from 'toastr'

/**
* REDUX
*/
import configureStore from 'store/configureStore'

import {
  setAuthToken,
  closeToastr,
} from 'actions/actions'

/**
* HELPERs
*/
import * as authTokenLocalStorage from 'utils/authtoken.localstorage'

/**
 * ROUTES
 */
import Router from 'router/Router'

const store = configureStore()
let currentToastrType
store.subscribe(() => {
  const state = store.getState()
  const previusToastr = currentToastrType
  currentToastrType = state.toastr.toastrType
  if (currentToastrType && previusToastr !== currentToastrType) {
    const { toastr } = state
    Toastr[toastr.toastrType](toastr.message, toastr.title, { timeOut: 2000 })
    store.dispatch(closeToastr())
  }
  authTokenLocalStorage.authTokenStorageHandler(state.account.authToken)
  // console.log("New State", state)
})

// set authToken if in localStorage
store.dispatch(setAuthToken(authTokenLocalStorage.getTokenFromStorage()))

// Styles
require.ensure([], require => {
  require('styles/main.scss')
}, 'app-styles')

require.ensure([], require => {
  require('toastr/build/toastr.css')
}, 'admin-static-assets-styles')

render(
  <Router store={store} />,
  document.getElementById('app')
)
