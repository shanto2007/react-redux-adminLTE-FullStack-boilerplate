import React from 'react'
import { connect } from 'react-redux'

class AppWrapper extends React.Component {
  render() {
    return (
      <div id="main-app-wrapper">
        { this.props.children }
      </div>
    )
  }
}

AppWrapper.propTypes = {
  children: React.PropTypes.node,
}

export default connect()(AppWrapper);
