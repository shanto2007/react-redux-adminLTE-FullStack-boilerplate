import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import {
  startLogout,
  openToastr,
} from 'actions/actions'

require('!style!css!sass!styles/components/admin-nav.scss')

class Navigation extends React.Component {

  onLogout() {
    const { dispatch } = this.props
    dispatch(startLogout())
    .then((res) => {
      if (res.success) {
        dispatch(openToastr('success', 'Logged off!'))
        window.location.replace('/')
      }
    })
    .catch((res) => {
      if (!res.success) {
        dispatch(openToastr('error', 'Error Loggin off!'))
      }
    })
  }

  isActiveNavItem(link) {
    const { router } = this.props
    if (link === router.route) {
      return 'active'
    }
    return ''
  }

  adminOnly() {
    const { user } = this.props.account
    if (user.admin) {
      return (
        <li className="active treeview">
          <a>
            <i className="fa fa-cog"></i> <span>Admin Area</span>
            <span className="pull-right-container">
              <i className="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul className="treeview-menu">
            <li className={this.isActiveNavItem('/admin/users')}>
              <Link to="/admin/users"><i className="fa fa-list"></i> Users</Link>
            </li>
            <li className={this.isActiveNavItem('/admin/settings')}>
              <Link to="/admin/settings"><i className="fa fa-cog"></i> Settings</Link>
            </li>
          </ul>
        </li>
      )
    }
    return null
  }

  render() {
    const { user } = this.props.account
    return (
      <div>
        <header className="main-header">
          <a href="/admin" className="logo">
            <span className="logo-lg"><b>Dashboard</b></span>
          </a>
          <nav className="navbar navbar-static-top">
            <a className="sidebar-toggle" data-toggle="offcanvas" role="button">
              <span className="sr-only">Toggle navigation</span>
            </a>

            <div className="navbar-custom-menu">
              <ul className="nav navbar-nav">
                <li className="dropdown user user-menu pointer" onClick={() => browserHistory.push('/admin/me')}>
                  <a className="dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-cog"></i><span className="hidden-xs">{user.username}</span>
                  </a>
                </li>
                <li className="pointer">
                  <a href="/" target="_blank" rel="noopener noreferrer"><i className="fa fa-eye"></i></a>
                </li>
                <li className="pointer" onClick={() => this.onLogout()}>
                  <a data-toggle="control-sidebar"><i className="fa fa-power-off"></i></a>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <aside className="main-sidebar">
          <section className="sidebar">
            <ul className="sidebar-menu">

              <li className="active treeview">
                <a>
                  <i className="fa fa-edit"></i> <span>Posts</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"></i>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className={this.isActiveNavItem('/admin/posts')}>
                    <Link to="/admin/posts"><i className="fa fa-list"></i> Posts List</Link>
                  </li>
                  <li className={this.isActiveNavItem('/admin/post/create')}>
                    <Link to="/admin/post/create"><i className="fa fa-plus"></i> Create Post</Link>
                  </li>
                </ul>
              </li>

              {this.adminOnly()}

            </ul>
          </section>
        </aside>
      </div>
    )
  }
}

Navigation.propTypes = {
  account: React.PropTypes.object,
  seasons: React.PropTypes.object,
  router: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  account: state.account,
  seasons: state.seasons,
  router: state.router,
}))(Navigation)
