import React from 'react'
import Box from 'Box'
import Moment from 'moment'
import { selectAdminRound, startGetAdminTeams, startGetAdminDays } from 'actions'

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
    if (nextProps.selectedRound !== this.selectedRound) {
      this.setState({
        selectedTeamHome: undefined,
        selectedTeamAway: undefined,
        selectedDay: undefined,
        matchDate: undefined,
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

  onRoundSelect(e, round) {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch } = this.props
    dispatch(selectAdminRound(round))
    dispatch(startGetAdminTeams(round._id)).then(() => {
      dispatch(startGetAdminDays(round._id))
    })
  }

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
        matchDate: Moment(e.target.value).unix(),
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
    console.log(this.state)
  }


  /**
   * Select list generators
   * enforce unique pair of teams
   */
  generateTeamHomeSelector() {
    const { teams } = this.props
    const { selectedTeamHome, selectedTeamAway } = this.state
    if (!teams.length) {
      return null
    }

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
    if (!teams.length) {
      return null
    }
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
    const { selectedDay, selectedRound } = this.state
    if (!days.length || !selectedRound) {
      return null
    }
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
    if (this.props.selectedRound) {
      return (
        <div className="col-sm-12 col-md-6">
          <label htmlFor="match-date">Select a date and time</label>
          <input name="match-date" className="form-control" type="datetime-local" onChange={(e) => this.onDateChange(e)} />
        </div>
      )
    }
    return null
  }

  /**
   * ROUNDS SELECTOR BUTTONS
   * TODO: prob should be a reusable component.
   */
  roundSelector() {
    const { selectedRound, rounds } = this.props
    if (rounds && rounds.length) {
      return (
        <div className="btn-group" style={{ display: 'block', margin: 'auto' }} name="round-selector">
        {
          rounds.map((round, i) => {
            let dinamicClass
            if (selectedRound) {
              dinamicClass = selectedRound._id === round._id ? 'active' : ''
            }
            return (
              <button key={i} onClick={(e) => this.onRoundSelect(e, round)} className={`btn btn-primary text-centered ${dinamicClass || ''}`}>
                <b>{round.label}</b>
              </button>
            )
          })
        }
        </div>
      )
    }
    return null
  }

  render() {
    const { state } = this
    return (
      <Box title="Create Match">
        <div className="round-selector clearfix ">
          <label htmlFor="round-selector">Select a round</label>
          {this.roundSelector()}
        </div>
        <hr />
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
              Create New Round
            </button>
          </div>
        </form>
      </Box>
    )
  }
}

MatchCreate.propTypes = {
  dispatch: React.PropTypes.func,
  season: React.PropTypes.object,
  rounds: React.PropTypes.array,
  days: React.PropTypes.array,
  teams: React.PropTypes.array,
  selectedRound: React.PropTypes.object,
}

export default MatchCreate
