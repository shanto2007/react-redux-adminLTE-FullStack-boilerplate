import React from 'react'
import { connect } from 'react-redux'
import { getAdminStaticAssets } from 'ChunkLoaders'
import AdminNav from 'AdminNav'
import { getUserData, startGetAdminSeasons, startGetCurrentSeason, startGetAdminRounds } from 'actions'

require('!style!css!sass!app/styles/admin/admin-nav.scss')

class AdminWrapper extends React.Component {
  componentWillMount() {
    /**
     * REMOVE APP LOADING STYLES AFTER EVERYTHING IS UP
     */
    getAdminStaticAssets()
      .then(() => {
        document.body.className = 'skin-blue sidebar-mini'
        const $app = document.getElementById('app')
        const $loader = document.getElementById('app-loader')
        $app.className = $app.className.replace('hide', '')
        $loader.className = 'hide'
      })
  }
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getUserData())
    dispatch(startGetAdminSeasons())
    dispatch(startGetCurrentSeason()).then(() => {
      dispatch(startGetAdminRounds())
    })
  }

  componentWillUnmount() {
    document.body.className = ''
  }
  render() {
    return (
      <div id="admin-app-wrapper" className="wrapper">
        <AdminNav />
        <div className="content-wrapper">
          <section className="content">
            {this.props.children}
          </section>
        </div>
      </div>
    )
  }
}

AdminWrapper.propTypes = {
  children: React.PropTypes.node,
  dispatch: React.PropTypes.func,
}

export default connect()(AdminWrapper)
