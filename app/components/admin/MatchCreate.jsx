import React from 'react'
import Moment from 'moment'
import {
  selectAdminRound,
  startGetAdminTeams,
  startGetAdminDays,
  startCreateNewMatch,
} from 'actions'

import Box from 'Box'
import RoundSwitcher from 'RoundSwitcher'

class MatchCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTeamHome: undefined,
      selectedTeamAway: undefined,
      selectedDay: undefined,
      matchDate: undefined,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedRound } = this.props
    const nextSelectedRound = nextProps.selectedRound
    if (nextSelectedRound !== selectedRound) {
      dispatch(startGetAdminTeams(nextSelectedRound._id))
        .then(() => {
          return dispatch(startGetAdminDays(nextSelectedRound._id))
        })
        .then(() => {
          this.setState({
            selectedTeamHome: undefined,
            selectedTeamAway: undefined,
            selectedDay: undefined,
            matchDate: undefined,
          })
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  // TODO save team in state, update only if new one, trigger 3 update on every round change, too much.
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (!nextProps.selectedRound || !this.props.selectedRound) {
  //     return false
  //   }
  //   return true
  // }

  /**
   * Match must have two different team, validation is up in the server
   * Doing another validation here to avoid possible errors, you never know
   */
  onTeamHomeSelection(e) {
    e.preventDefault()
    e.stopPropagation()
    const teamId = e.target.value
    return this.setState({
      selectedTeamHome: teamId,
    })
  }

  onTeamAwaySelection(e) {
    e.preventDefault()
    e.stopPropagation()
    const teamId = e.target.value
    return this.setState({
      selectedTeamAway: teamId,
    })
  }

  onDateChange(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.target.value && e.target.value.length) {
      this.setState({
        matchDate: Moment(e.target.value),
      })
    } else if (!e.target.value.length) {
      this.setState({
        matchDate: undefined,
      })
    }
  }

  onDaySelection(e) {
    e.stopPropagation()
    e.preventDefault()
    const dayId = e.target.value
    if (dayId) {
      this.setState({
        selectedDay: dayId,
      })
    }
  }

  onMatchCreate(e) {
    e.preventDefault()
    e.stopPropagation()

    const {
      dispatch,
      season,
      selectedRound,
    } = this.props
    const {
      selectedDay,
      selectedTeamHome,
      selectedTeamAway,
      matchDate,
    } = this.state

    const newMatch = {}
    newMatch.season = season._id
    newMatch.round = selectedRound._id
    newMatch.day = selectedDay
    newMatch.teamHome = selectedTeamHome
    newMatch.teamAway = selectedTeamAway
    newMatch.date = matchDate
    console.log(matchDate)
    dispatch(startCreateNewMatch(newMatch)).then(() => {
      dispatch(selectAdminRound(null))
    }).catch()
  }


  /**
   * Select list generators
   * enforce unique pair of teams
   */
  generateTeamHomeSelector() {
    const { teams } = this.props
    const { selectedTeamHome, selectedTeamAway } = this.state
    const validTeams = teams.filter((team) => {
      if (!selectedTeamAway || (team._id !== selectedTeamAway)) {
        return true
      }
      return false
    })
    return (
      <div className="col-sm-12 col-md-6">
        <label htmlFor="TeamHomeLists">Choose Team Home</label>
        <select className="form-control" name="TeamHomeLists" value={selectedTeamHome || '0'} onChange={(e) => this.onTeamHomeSelection(e)}>
          <option value="0" disabled>Select Home Team</option>
          {
            validTeams.map((team, i) => {
              return (
                <option key={i} value={team._id}>
                  {team.name}
                </option>
              )
            })
          }
        </select>
      </div>
    )
  }

  generateTeamAwaySelector() {
    const { teams } = this.props
    const { selectedTeamHome, selectedTeamAway } = this.state
    const validTeams = teams.filter((team) => {
      if (!selectedTeamHome || (team._id !== selectedTeamHome)) {
        return true
      }
      return false
    })

    return (
      <div className="col-sm-12 col-md-6">
        <label htmlFor="TeamAwayLists">Choose Team Away</label>
        <select className="form-control" name="TeamAwayLists" value={selectedTeamAway || '0'} onChange={(e) => this.onTeamAwaySelection(e)}>
          <option value="0" disabled>Select Home Team</option>
          {
            validTeams.map((team, i) => {
              return (
                <option key={i} value={team._id}>
                  {team.name}
                </option>
              )
            })
          }
        </select>
      </div>
    )
  }

  generateDaySelector() {
    const { days } = this.props
    const { selectedDay } = this.state
    return (
      <div className="col-sm-12 col-md-6">
        <label htmlFor="DaysList">Choose a Day</label>
        <select className="form-control" name="TeamAwayLists" value={selectedDay || '0'} onChange={(e) => this.onDaySelection(e)}>
          <option value="0" disabled>Select Match Day</option>
          {
            days.map((day, i) => {
              return (
                <option key={i} value={day._id}>
                  {i}
                </option>
              )
            })
          }
        </select>
      </div>
    )
  }

  dateTimeSelector() {
    return (
      <div className="col-sm-12 col-md-6">
        <label htmlFor="match-date">Select a date and time</label>
        <input name="match-date" className="form-control" type="datetime-local" onChange={(e) => this.onDateChange(e)} />
      </div>
    )
  }

  showMatchCreationSelectors() {
    const { state } = this
    if (this.props.selectedRound) {
      return (
        <form onSubmit={(e) => this.onMatchCreate(e)}>
          {this.generateTeamHomeSelector()}
          {this.generateTeamAwaySelector()}
          {this.generateDaySelector()}
          {this.dateTimeSelector()}
          <div className="clearfix"></div>
          <div className="submit-box">
            <button
              type="submit"
              className="btn btn-primary pull-right"
              disabled={!state.selectedTeamHome || !state.selectedTeamAway || !state.selectedDay || !state.matchDate}
            >
              Create New Match
            </button>
          </div>
        </form>
      )
    }
    return null
  }

  render() {
    return (
      <Box title="Create Match" filters={<RoundSwitcher />}>
        {this.showMatchCreationSelectors()}
      </Box>
    )
  }
}

MatchCreate.propTypes = {
  dispatch: React.PropTypes.func,
  season: React.PropTypes.object,
  days: React.PropTypes.array,
  teams: React.PropTypes.array,
  selectedRound: React.PropTypes.object,
}

export default MatchCreate
