import React from 'react'
import { Provider, connect } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { getUserData, setAuthToken } from 'actions/actions'

import MainWrapper from 'views/MainWrapper'

const genRoutes = (AdminRouter) => {
  const routes = [
    {
      path: '/login',
      getComponents: (a, cb) => require.ensure([], () => cb(null, require('views/auth/Login').default)),
      onEnter: AdminRouter.redirectIfLoggedIn.bind(AdminRouter),
    },
    {
      path: '/register',
      getComponents: (a, cb) => require.ensure([], (require) => { cb(null, require('views/auth/Register').default) }),
    },
    {
      path: '/admin',
      component: MainWrapper,
      indexRoute: {
        getComponents: (a, cb) => require.ensure([], () => cb(null, require('views/dashboard/Dashboard').default)),
      },
      onEnter: AdminRouter.requireAuth.bind(AdminRouter),
      childRoutes: [
        {
          path: 'posts',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('views/posts/List').default)),
        },
        {
          path: 'post/create',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('views/posts/Create').default)),
        },
        {
          path: 'post/:id',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('views/posts/Edit').default)),
        },
        {
          path: 'users',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('views/users/List').default)),
        },
        {
          path: 'me',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('views/users/Me').default)),
        },
        {
          path: 'settings',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('views/settings/Settings').default)),
        },
        {
          path: '*',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('views/errors/NotFound').default)),
        },
      ],
    },
  ]
  return routes
}

export class AdminRouter extends React.Component {
  requireAuth(nextState, replace, next) {
    const { dispatch } = this.props
    const { store } = this.props
    //  CHECK TOKEN AND INVALIDATE IF NEEDED
    return dispatch(getUserData()).then((res) => {
      if (res.status !== 200) {
        store.dispatch(setAuthToken(''))
      }
      return res
    })
    .then(() => {
      const state = store.getState()
      const { account } = state
      if (account.authToken) {
        next()
      } else {
        browserHistory.push('/login')
      }
    })
  }
  redirectIfLoggedIn(nextState, replace, next) {
    const state = this.props.store.getState()
    const { account } = state
    if (account.authToken) {
      browserHistory.push('/admin')
    } else {
      next()
    }
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory} routes={genRoutes(this)} />
      </Provider>
    )
  }
}

AdminRouter.propTypes = {
  dispatch: React.PropTypes.func,
  store: React.PropTypes.object,
}

export default connect()(AdminRouter)
