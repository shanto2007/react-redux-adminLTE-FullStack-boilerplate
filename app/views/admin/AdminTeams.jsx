import React from 'react'
import { connect } from 'react-redux'
import { selectAdminRound, clearAdminTeams } from 'actions'

/**
 * COMPs
 */
import Callout from 'Callout'
import TeamCreate from 'TeamCreate'
import TeamsList from 'TeamsList'

class AdminTeams extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(selectAdminRound(null))
    dispatch(clearAdminTeams())
  }

  render() {
    const { seasons, season, rounds, teams, selectedRound, dispatch } = this.props
    if (!seasons.length) {
      return <Callout title="No Season created yet!" message="Create a season in the season section before creating rounds!" />
    } else if (!season) {
      return <Callout title="No Season selected!" message="Select a season to edit in the topbar menu!" />
    }
    return (
      <div id="admin-team-list" className="container-fluid">
        <TeamCreate season={season} rounds={rounds} dispatch={dispatch} />
        <TeamsList season={season} teams={teams} selectedRound={selectedRound} rounds={rounds} dispatch={dispatch} />
      </div>
    )
  }
}

AdminTeams.propTypes = {
  dispatch: React.PropTypes.func,
  seasons: React.PropTypes.array,
  season: React.PropTypes.object,
  rounds: React.PropTypes.array,
  teams: React.PropTypes.array,
  selectedRound: React.PropTypes.object,
}

export default connect((state) => ({
  seasons: state.seasons.seasons,
  season: state.seasons.viewed,
  rounds: state.rounds.rounds,
  teams: state.teams.teams,
  selectedRound: state.rounds.selected,
}))(AdminTeams)
