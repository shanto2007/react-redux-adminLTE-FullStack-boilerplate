import React from 'react'
import { Provider, connect } from 'react-redux'
import { Route, Router, IndexRoute, browserHistory } from 'react-router'
import { resetProjectData } from 'actions'

/** COMPONENTS **/
import AppWrapper from 'AppWrapper'
import Home from 'Home'
import Login from 'Login'
import Register from 'Register'
import NotFound from 'NotFound'

import AdminWrapper from 'AdminWrapper'
import ProjectCreate from 'ProjectCreate'
import ProjectEdit from 'ProjectEdit'
import ProjectList from 'ProjectList'
import CategoryList from 'CategoryList'
import Settings from 'Settings'

export class Routes extends React.Component {
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

  clearProject() {
    const { dispatch } = this.props;
    dispatch(resetProjectData())
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory}>
          <Route path="/" component={AppWrapper}>
            <IndexRoute component={Home} />
            <Route path="/login" component={Login} onEnter={this.redirectIfLoggedIn.bind(this)}></Route>
            <Route path="/join" component={Register}></Route>
          </Route>
          <Route path="/admin" component={AdminWrapper} onEnter={this.requireAuth.bind(this)}>
            <IndexRoute component={ProjectList} />
            <Route path="categories" component={CategoryList}></Route>
            <Route path="projects" component={ProjectList}></Route>
            <Route path="project">
              <IndexRoute component={ProjectCreate} onEnter={this.clearProject.bind(this)} onLeave={this.clearProject.bind(this)} />
              <Route path=":id" component={ProjectEdit}></Route>
            </Route>
            <Route path="settings" component={Settings}></Route>
          </Route>
          <Route path="*" component={NotFound}></Route>
        </Router>
      </Provider>
    )
  }
}

Routes.propTypes = {
  dispatch: React.PropTypes.func,
  store: React.PropTypes.object,
};

export default connect()(Routes);
