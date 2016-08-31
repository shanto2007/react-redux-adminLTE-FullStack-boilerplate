import React from 'react'
import { connect } from 'react-redux'
import AdminNav from 'AdminNav';

require('!style!css!admin-lte/bootstrap/css/bootstrap.css');
require('!style!css!admin-lte/dist/css/AdminLTE.min.css');
require('!style!css!admin-lte/dist/css/skins/skin-blue.min.css')
require('!style!css!font-awesome/css/font-awesome.css')


class AdminWrapper extends React.Component {
  componentDidMount() {
    require('!script!admin-lte/bootstrap/js/bootstrap.min.js')
    require('!script!admin-lte/dist/js/app.min.js')
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
