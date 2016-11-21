import React from 'react'
import { connect } from 'react-redux'

import { getAdminStaticAssets } from 'utils/ChunkLoaders'
import Navigation from 'components/Navigation'


class MainWrapper extends React.Component {
  componentWillMount() {
    /**
     * REMOVE APP LOADING STYLES AFTER EVERYTHING IS UP
     */
    getAdminStaticAssets()
      .then(() => {
        const $app = document.getElementById('app')
        const $loaderWrapper = document.getElementById('loader-wrapper')
        const $body = document.body
        $body.className = $body.className.replace('app-loading', '')
        $loaderWrapper.className = 'hide'
        $app.className = $app.className.replace('hide', '')
      })
  }
  render() {
    return (
      <div id="admin-app-wrapper" className="wrapper">
        <Navigation />
        <div className="content-wrapper">
          <section className="content">
            {this.props.children}
          </section>
        </div>
      </div>
    )
  }
}

MainWrapper.propTypes = {
  children: React.PropTypes.node,
}

export default connect()(MainWrapper);
