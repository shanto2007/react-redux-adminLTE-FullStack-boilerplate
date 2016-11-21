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
import * as authTokenLocalStorage from 'lib/authtoken.localstorage'

/**
 * ROUTES
 */
import AdminRouter from './AdminRouter'


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
  require('style!css!sass!styles/app.scss')
}, 'app-styles')

require('style!css!toastr/build/toastr.css')


render(
  <AdminRouter store={store} />,
  document.getElementById('app')
)
