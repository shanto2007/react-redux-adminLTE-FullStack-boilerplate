import React from 'react'
import { connect } from 'react-redux'
import { startGetPublicLatestProjects } from 'actions'

import Gallery from 'Gallery';

class PublicLatestProjects extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(startGetPublicLatestProjects())
  }

  renderList() {
    if (this.props.projects) {
      return <Gallery elements={this.props.projects} />
    }
    return null;
  }

  render() {
    return (
      <div id="latest-project" className="columns">
        <div className="row">
          <h2 className="section-title">Latest Project</h2>
          <div className="grid">
            { this.renderList() }
          </div>
        </div>
      </div>
    )
  }
}

PublicLatestProjects.propTypes = {
  dispatch: React.PropTypes.func,
  projects: React.PropTypes.array,
}

export default connect((state) => ({
  projects: state.publicProjects.latestProjects,
}))(PublicLatestProjects);
