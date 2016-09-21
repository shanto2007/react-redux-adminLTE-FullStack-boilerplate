import React from 'react'
import { connect } from 'react-redux'
import {
  startGetAdminSingleTeam,
  clearAdminTeam,
} from 'actions'

/**
 * COMPs
 */
import Callout from 'Callout'

class AdminTeam extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { id } = this.props.params
    if (id) {
      dispatch(startGetAdminSingleTeam(id))
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearAdminTeam())
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
        <hr />
        <pre>{JSON.stringify(this.props.team)}</pre>
      </div>
    )
  }
}

AdminTeam.propTypes = {
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  seasonExists: React.PropTypes.bool,
  season: React.PropTypes.object,
  team: React.PropTypes.object,
}

export default connect((state) => ({
  seasonExists: !!state.seasons.seasons.length,
  season: state.seasons.viewed,
  team: state.team,
}))(AdminTeam)
