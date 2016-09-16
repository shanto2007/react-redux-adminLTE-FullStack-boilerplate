import React from 'react'
import { Provider, connect } from 'react-redux'
import { Router, browserHistory } from 'react-router'

/** COMPONENTS **/
import PublicWrapper from 'PublicWrapper'

const routes = [
  {
    path: '/',
    component: PublicWrapper,
    indexRoute: {
      getComponents: (a, cb) => require.ensure([], require => { cb(null, require('Home').default) }),
    },
    childRoutes: [
      // {
      //   path: '/projects',
      //   getComponents: (a, cb) => require.ensure([], require => { cb(null, require('PublicProjects').default) }),
      // },
    ],
  },
  {
    path: '*',
    getComponents: (a, cb) => require.ensure([], require => { cb(null, require('NotFound').default) }),
  },
]


export class PublicRoutes extends React.Component {

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory} routes={routes} />
      </Provider>
    )
  }
}

PublicRoutes.propTypes = {
  dispatch: React.PropTypes.func,
  store: React.PropTypes.object,
};

export default connect()(PublicRoutes);
