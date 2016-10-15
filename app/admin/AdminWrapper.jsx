import React from 'react'
import { connect } from 'react-redux'
import { loadAdminStaticAssets } from 'ChunkLoaders'
import AdminNav from 'AdminNav'


class AdminWrapper extends React.Component {
  componentDidMount() {
    loadAdminStaticAssets()
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
}

export default connect()(AdminWrapper);
