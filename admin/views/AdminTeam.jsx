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
import TeamInfo from 'TeamInfo'
import TeamPlayerCreate from 'TeamPlayerCreate'
import TeamSinglePlayer from 'TeamSinglePlayer'

require('!style!css!sass!../styles/admin/single-team.scss')

class AdminTeam extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
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

  renderPlayerLists() {
    const { team } = this.props.team
    const { dispatch } = this.props
    if (team && team.players.length) {
      return team.players.map((player, i) => {
        return (
          <div className="col-sm-12 col-md-4 single-player-badge" key={i}>
            <TeamSinglePlayer player={player} dispatch={dispatch} />
          </div>
        )
      })
    }
    return null
  }

  render() {
    const {
      seasonExists,
      season,
      team,
      dispatch,
    } = this.props

    if (!seasonExists) {
      return <Callout title="No Season created yet!" message="Create a season in the season section before creating rounds!" />
    } else if (!season) {
      return <Callout title="No Season selected!" message="Select a season to edit in the topbar menu!" />
    }
    return (
      <div id="admin-single-team" className="container-fluid">
        <TeamInfo team={team.team} dispatch={dispatch} />
        <TeamPlayerCreate dispatch={dispatch} team={team.team} />
        <div className="row">
          {this.renderPlayerLists()}
        </div>
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
