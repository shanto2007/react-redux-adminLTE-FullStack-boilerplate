import React from 'react'
import { connect } from 'react-redux'
import AdminNav from 'AdminNav'
import { getUserData, startGetAdminSeasons, startGetCurrentSeason, startGetAdminRounds } from 'actions'

require('!style!css!sass!app/styles/admin/admin-nav.scss')

//  Chunk assets to lazy load
function getStaticAssets() {
  const { Promise } = global
  return new Promise(resolve => {
    require.ensure([], () => {
      require('!style!css!admin-lte/bootstrap/css/bootstrap.min.css')
      require('!style!css!admin-lte/dist/css/AdminLTE.min.css')
      require('!style!css!admin-lte/dist/css/skins/skin-blue.min.css')
      require('!style!css!font-awesome/css/font-awesome.min.css')
      require('!script!admin-lte/bootstrap/js/bootstrap.min.js')
      require('!script!admin-lte/dist/js/app.min.js')

      resolve()
    }, 'admin-static-assets')
  })
}


class AdminWrapper extends React.Component {
  componentWillMount() {
    /**
     * REMOVE APP LOADING STYLES AFTER EVERYTHING IS UP
     */
    getStaticAssets()
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
