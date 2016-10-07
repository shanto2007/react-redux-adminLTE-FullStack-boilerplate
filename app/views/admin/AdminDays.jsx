import React from 'react'
import { connect } from 'react-redux'
import { clearAdminDays } from 'actions'

/**
 * COMPs
 */
import Callout from 'Callout'
import DayCreate from 'DayCreate'
import DaysList from 'DaysList'

class AdminDays extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearAdminDays(null))
  }

  render() {
    const { seasons, season, rounds, days, selectedRound, dispatch } = this.props
    if (!seasons.length) {
      return <Callout title="No Season created yet!" message="Create a season in the season section before creating rounds!" />
    } else if (!season) {
      return <Callout title="No Season selected!" message="Select a season to edit in the topbar menu!" />
    } else if (!rounds.length) {
      return <Callout title="No rounds created yet!" message="Create at least one round for the current season!" />
    }
    return (
      <div id="admin-days" className="container-fluid">
        <div className="col-sm-12 col-md-6">
          <DayCreate dispatch={dispatch} season={season} rounds={rounds} />
        </div>
        <div className="col-sm-12 col-md-6">
          <DaysList dispatch={dispatch} season={season} days={days} selectedRound={selectedRound} rounds={rounds} />
        </div>
      </div>
    )
  }
}

AdminDays.propTypes = {
  dispatch: React.PropTypes.func,
  seasons: React.PropTypes.array,
  season: React.PropTypes.object,
  days: React.PropTypes.object,
  rounds: React.PropTypes.array,
  selectedRound: React.PropTypes.object,
}


export default connect((state) => ({
  seasons: state.seasons.seasons,
  season: state.seasons.viewed,
  rounds: state.rounds.rounds,
  days: state.days,
  selectedRound: state.rounds.selected,
}))(AdminDays)
