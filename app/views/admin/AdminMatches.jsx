import React from 'react'
import { connect } from 'react-redux'
import {
  clearAdminMatches,
} from 'actions'

/**
 * COMPs
 */
import Callout from 'Callout'
import MatchesList from 'MatchesList'

class AdminMatches extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearAdminMatches())
  }

  render() {
    const {
      seasonExists,
      season,
      selectedRound,
      matches,
      dispatch,
    } = this.props

    if (!seasonExists) {
      return <Callout title="No Season created yet!" message="Create a season in the season section before creating rounds!" />
    } else if (!season) {
      return <Callout title="No Season selected!" message="Select a season to edit in the topbar menu!" />
    }
    return (
      <div id="admin-matches-list" className="container-fluid">
        <MatchesList dispatch={dispatch} matches={matches.matches} selectedRound={selectedRound} />
      </div>
    )
  }
}

AdminMatches.propTypes = {
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  seasonExists: React.PropTypes.bool,
  selectedRound: React.PropTypes.object,
  season: React.PropTypes.object,
  matches: React.PropTypes.object,
}

export default connect((state) => ({
  seasonExists: !!state.seasons.seasons.length,
  season: state.seasons.viewed,
  selectedRound: state.rounds.selected,
  matches: state.matches,
}))(AdminMatches)
