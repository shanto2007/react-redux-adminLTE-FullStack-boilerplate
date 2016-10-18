import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { startLogout, openToastr, setAdminViewedSeason } from 'actions'

require('!style!css!sass!../styles/admin/admin-nav.scss')

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

  renderViewedSeasonList() {
    const { seasons, viewed } = this.props.seasons
    if (seasons && seasons.length) {
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
    return (
      <li style={{ display: 'block' }}>
        <Link to="/admin/seasons" className="bold text-center">Create a season!</Link>
      </li>
    )
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
                <li className="dropdown notifications-menu pointer">
                  <a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    Viewing season:
                    <b> { viewed ? viewed.year : 'No Season!' }</b>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="header">Avaible seasons</li>
                    <li>
                      <ul className="menu">
                        { this.renderViewedSeasonList() }
                      </ul>
                    </li>
                    <li className="footer">
                      <Link to="/admin/seasons">View All</Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown user user-menu pointer">
                  <a className="dropdown-toggle" data-toggle="dropdown">
                    <span className="hidden-xs">{user.username}</span>
                  </a>
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
              <li className="header">DASHBOARD</li>

              <li className="active treeview">
                <a>
                  <i className="fa fa-pencil"></i> <span>Creation</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"></i>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className={this.isActiveNavItem('/admin/seasons')}>
                    <Link to="/admin/seasons"><i className="fa fa-list"></i> Seasons</Link>
                  </li>
                  <li className={this.isActiveNavItem('/admin/rounds')}>
                    <Link to="/admin/rounds"><i className="fa fa-sitemap"></i> Rounds</Link>
                  </li>
                  <li className={this.isActiveNavItem('/admin/days')}>
                    <Link to="/admin/days"><i className="fa fa-calendar"></i> Days</Link>
                  </li>
                  <li className={this.isActiveNavItem('/admin/team/create')}>
                    <Link to="/admin/team/create"><i className="fa fa-users"></i> Teams</Link>
                  </li>
                  <li className={this.isActiveNavItem('/admin/match/create')}>
                    <Link to="/admin/match/create"><i className="fa fa-futbol-o"></i> Matches</Link>
                  </li>
                </ul>
              </li>

              <li className="active treeview">
                <a>
                  <i className="fa fa-calendar"></i> <span>Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"></i>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className={this.isActiveNavItem('/admin/teams')}>
                    <Link to="/admin/teams"><i className="fa fa-users"></i> Teams List</Link>
                  </li>
                  <li className={this.isActiveNavItem('/admin/matches')}>
                    <Link to="/admin/matches"><i className="fa fa-futbol-o"></i> Matches List</Link>
                  </li>
                </ul>
              </li>

              {this.adminOnly()}

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
  router: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  account: state.account,
  seasons: state.seasons,
  router: state.router,
}))(AdminNav)
