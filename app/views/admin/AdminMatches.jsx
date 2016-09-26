import React from 'react'
import { connect } from 'react-redux'

/**
 * COMPs
 */
import Callout from 'Callout'
import MatchCreate from 'MatchCreate'
// import TeamsList from 'TeamsList'

class AdminMatches extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { seasons, season, rounds, teams, selectedRound, dispatch } = this.props
    if (!seasons.length) {
      return <Callout title="No Season created yet!" message="Create a season in the season section before creating rounds!" />
    } else if (!season) {
      return <Callout title="No Season selected!" message="Select a season to edit in the topbar menu!" />
    } else if (!rounds.length) {
      return <Callout title="No rounds created yet!" message="Create at least one round for the current season!" />
    }
    return (
      <div id="admin-matches-list" className="container-fluid">
        <h1>Match Creation</h1>
      </div>
    )
  }
}

AdminMatches.propTypes = {
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
}))(AdminMatches)
