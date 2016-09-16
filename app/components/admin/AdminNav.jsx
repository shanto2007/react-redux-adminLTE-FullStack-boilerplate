import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { startLogout, openToastr, setAdminViewedSeason } from 'actions'

class AdminNav extends React.Component {
  onLogout() {
    const { dispatch } = this.props;
    dispatch(startLogout())
    .then((res) => {
      console.log(res);
      if (res.success) {
        dispatch(openToastr('success', 'Logged off!'));
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

  setViewedSeasonHandler(e, season) {
    e.stopPropagation()
    const { dispatch } = this.props
    dispatch(setAdminViewedSeason(season))
  }

  renderViewedSeasonList() {
    const { seasons, viewed } = this.props.seasons
    if (seasons) {
      return seasons.map((season) => {
        let classes = ''
        if (viewed) {
          classes = viewed._id === season._id ? 'bold' : ''
        }
        return (
          <li style={{ display: 'block' }} key={season._id} onClick={(e) => this.setViewedSeasonHandler(e, season)}>
            <a className={`text-center ${classes}`}> {season.year} { season.current ? ' (current)' : ''}</a>
          </li>
        )
      })
    }
    return null
  }

  render() {
    const { user } = this.props.account
    const { viewed } = this.props.seasons
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
                <li className="dropdown notifications-menu">
                  <a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    Viewing season:
                    <b> { viewed ? viewed.year : '' }</b>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="header">Avaible seasons</li>
                    <li>
                      <ul className="menu">
                        { this.renderViewedSeasonList() }
                      </ul>
                    </li>
                    <li className="footer"><a>View all</a></li>
                  </ul>
                </li>
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
  seasons: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  account: state.account,
  seasons: state.seasonAdmin,
}))(AdminNav)
