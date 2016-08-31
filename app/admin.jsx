import React from 'react'
import { render } from 'react-dom'

/**
 * ROUTES
 */
import AdminRoutes from 'AdminRoutes'

/**
 * REDUX
 */
import configureStore from 'configureStore'
import {
  setAuthToken,
  closeToastr,
} from 'actions'

/**
 * HELPERs
 */
import * as authTokenLocalStorage from 'authtoken.localstorage'

//  Toaster
import Toastr from 'toastr'

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
  require('style!css!sass!applicationStyles')
}, 'app-styles')

require('style!css!toastr/build/toastr.css')


render(
  <AdminRoutes store={store} />,
  document.getElementById('app')
)
