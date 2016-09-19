import React from 'react'
import { render } from 'react-dom'

/**
 * ROUTES
 */
import PublicRoutes from 'PublicRoutes'

/**
 * REDUX
 */
import configureStore from 'configurePublicStore'

const store = configureStore()

store.subscribe(() => {
  // const state = store.getState()
})

// Foundation init
/*eslint-disable */
// $(window.document).foundation()
/*eslint-enable */

// Styles
require.ensure([], require => {
  require('style!css!sass!publicStyles')
}, 'app-styles')

render(
  <PublicRoutes store={store} />,
  document.getElementById('app')
)
