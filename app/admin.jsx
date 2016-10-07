import React from 'react'
import { render } from 'react-dom'

/**
 * ROUTES
 */
import AdminRoutes from 'AdminRoutes'

/**
 * REDUX
 */
import configureStore from 'configureAdminStore'
import {
  setAuthToken,
  closeToastr,
  startGetAdminRounds,
  clearAdminDays,
  clearAdminTeams,
  clearAdminMatches,
  selectAdminRound,
} from 'actions'

/**
 * HELPERs
 */
import * as authTokenLocalStorage from 'authtoken.localstorage'

//  Toaster
import Toastr from 'toastr'

const store = configureStore()
let currentToastrType, currentViewedSeason
store.subscribe(() => {
  const state = store.getState()
  const { toastr } = state
  const previusToastr = currentToastrType
  currentToastrType = state.toastr.toastrType
  if (currentToastrType && previusToastr !== currentToastrType) {
    Toastr[toastr.toastrType](toastr.message, toastr.title, { timeOut: 2000 })
    store.dispatch(closeToastr())
  }
  authTokenLocalStorage.authTokenStorageHandler(state.account.authToken)

  /**
   * SEASON SWITCH
   * - Cleanup season own data in store
   * TODO: remove manual cleanup around in components to have in one place here
   */
  const prevViewedSeason = currentViewedSeason
  currentViewedSeason = state.seasons.viewed
  if (currentViewedSeason && currentViewedSeason !== prevViewedSeason) {
    store.dispatch(clearAdminDays())
    store.dispatch(clearAdminTeams())
    store.dispatch(clearAdminMatches())
    store.dispatch(selectAdminRound(null))
    store.dispatch(startGetAdminRounds(currentViewedSeason._id))
  }
})

// set authToken if in localStorage
store.dispatch(setAuthToken(authTokenLocalStorage.getTokenFromStorage()))

// Styles
require.ensure([], require => {
  require('style!css!sass!adminStyles')
}, 'app-styles')

require.ensure([], require => {
  require('style!css!toastr/build/toastr.css')
}, 'admin-static-assets-styles')

render(
  <AdminRoutes store={store} />,
  document.getElementById('app')
)
