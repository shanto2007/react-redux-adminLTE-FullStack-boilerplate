import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { startLogout, openToastr } from 'actions'

class AdminNav extends React.Component {
  onLogout() {
    const { dispatch } = this.props;
    dispatch(startLogout())
    .then((res) => {
      console.log(res);
      if (res.success) {
        dispatch(openToastr('success', 'Logged off!'));
        // browserHistory.push('/');
        window.location.replace('/')
      }
    })
    .catch((res) => {
      if (!res.success) {
        dispatch(openToastr('error', 'Error Loggin off!'));
        console.error(res.message);
      }
    })
  }
  render() {
    const { user } = this.props.account;
    return (
      <div>
        <header className="main-header">
          <a href="/" className="logo">
            <span className="logo-lg"><b>Dashboard</b></span>
          </a>
          <nav className="navbar navbar-static-top">
            <a className="sidebar-toggle" data-toggle="offcanvas" role="button">
              <span className="sr-only">Toggle navigation</span>
            </a>

            <div className="navbar-custom-menu">
              <ul className="nav navbar-nav">

                <li className="dropdown user user-menu">

                  <a className="dropdown-toggle" data-toggle="dropdown">
                    <span className="hidden-xs">{user.username}</span>
                  </a>
                </li>
                <li onClick={() => this.onLogout()}>
                  <a data-toggle="control-sidebar"><i className="fa fa-power-off"></i></a>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <aside className="main-sidebar">
          <section className="sidebar">
            <ul className="sidebar-menu">
              <li className="header">DASHBOARD</li>

              <li className="active treeview">
                <a>
                  <i className="fa fa-pencil"></i> <span>Creation</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"></i>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className="active">
                    <Link to="/admin/seasons"><i className="fa fa-list"></i> Seasons</Link>
                  </li>
                </ul>
              </li>

              <li className="active treeview">
                <a>
                  <i className="fa fa-pencil"></i> <span>Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"></i>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className="active">
                    {/* <Link to="/admin/users"><i className="fa fa-list"></i> Seasons</Link>
                    <Link to="/admin/users/create"><i className="fa fa-plus"></i> Create</Link> */}
                  </li>
                </ul>
              </li>

              <li className="active treeview">
                <a>
                  <i className="fa fa-pencil"></i> <span>Users</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"></i>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className="active">
                    <Link to="/admin/users"><i className="fa fa-list"></i> Users</Link>
                    <Link to="/admin/users/create"><i className="fa fa-plus"></i> Create</Link>
                  </li>
                </ul>
              </li>

              <li className="active treeview">
                <a>
                  <i className="fa fa-cog"></i> <span>Settings</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"></i>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className="active">
                    <Link to="/admin/settings"><i className="fa fa-cog"></i> Settings</Link>
                  </li>
                </ul>
              </li>

            </ul>
          </section>
        </aside>
      </div>
    );
  }
}

AdminNav.propTypes = {
  account: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  account: state.account,
}))(AdminNav)
