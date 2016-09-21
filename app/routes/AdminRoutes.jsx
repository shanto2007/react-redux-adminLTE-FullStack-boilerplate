import React from 'react'
import { Provider, connect } from 'react-redux'
import { Router, browserHistory } from 'react-router'

import AdminWrapper from 'AdminWrapper'

const genRoutes = (adminRoutes) => {
  const routes = [
    {
      path: '/login',
      getComponents: (a, cb) => require.ensure([], () => cb(null, require('Login').default)),
      onEnter: adminRoutes.redirectIfLoggedIn.bind(adminRoutes),
    },
    {
      path: '/join',
      getComponents: (a, cb) => require.ensure([], require => { cb(null, require('Register').default) }),
    },
    {
      path: '/admin',
      component: AdminWrapper,
      indexRoute: {
        getComponents: (a, cb) => require.ensure([], () => cb(null, require('AdminUsersList').default)),
      },
      onEnter: adminRoutes.requireAuth.bind(adminRoutes),
      childRoutes: [
        {
          path: 'seasons',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('AdminSeasons').default)),
        },
        {
          path: 'rounds',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('AdminRounds').default)),
        },
        {
          path: 'days',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('AdminDays').default)),
        },
        {
          path: 'teams',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('AdminTeams').default)),
        },
        {
          path: 'users',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('AdminUsersList').default)),
        },
        {
          path: 'settings',
          getComponents: (a, cb) => require.ensure([], () => cb(null, require('Settings').default)),
        },
      ],
    },
  ]
  return routes
}

export class AdminRoutes extends React.Component {
  requireAuth(nextState, replace, next) {
    const state = this.props.store.getState();
    const { account } = state;
    if (account.authToken) {
      next();
    } else {
      browserHistory.push('/login')
    }
    return;
  }
  redirectIfLoggedIn(nextState, replace, next) {
    const state = this.props.store.getState();
    const { account } = state;
    if (account.authToken) {
      browserHistory.push('/admin')
    } else {
      next();
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

AdminRoutes.propTypes = {
  dispatch: React.PropTypes.func,
  store: React.PropTypes.object,
};

export default connect()(AdminRoutes);
