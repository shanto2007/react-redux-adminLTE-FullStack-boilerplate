import React from 'react'
import { connect } from 'react-redux'

import PublicLanding from 'PublicLanding'

class Home extends React.Component {
  render() {
    return (
      <div id="homepage">
        <PublicLanding />
      </div>
    )
  }
}

export default connect()(Home);
