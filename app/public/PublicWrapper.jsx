import React from 'react'
import { connect } from 'react-redux'

import PublicNav from 'PublicNav'

import WebFont from 'webfontloader'

class PublicWrapper extends React.Component {

  componentDidMount() {
    WebFont.load({
      google: {
        families: ['Roboto:400,700'],
      },
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <PublicNav />
        {this.props.children}
      </div>
    );
  }
}

PublicWrapper.propTypes = {
  children: React.PropTypes.node,
}

export default connect()(PublicWrapper);
