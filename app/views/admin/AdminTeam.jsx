import React from 'react'
import { connect } from 'react-redux'

/**
 * COMPs
 */
import Callout from 'Callout'

class AdminTeam extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      seasonExists,
      season,
    } = this.props

    if (!seasonExists) {
      return <Callout title="No Season created yet!" message="Create a season in the season section before creating rounds!" />
    } else if (!season) {
      return <Callout title="No Season selected!" message="Select a season to edit in the topbar menu!" />
    }
    return (
      <div>
        TEAM {this.props.params.id}
      </div>
    )
  }
}

AdminTeam.propTypes = {
  dispatch: React.PropTypes.func,
  seasonExists: React.PropTypes.bool,
  season: React.PropTypes.object,
}

export default connect((state) => ({
  seasonExists: !!state.seasons.seasons.length,
  season: state.seasons.viewed,
}))(AdminTeam)
