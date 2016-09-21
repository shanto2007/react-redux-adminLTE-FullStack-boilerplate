import React from 'react'
import { Link } from 'react-router'
import Box from 'Box'
import {
  selectAdminRound,
  startGetAdminTeams,
  startDeleteTeam,
  clearAdminTeams,
} from 'actions'

class TeamsList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props

    const selectedRound = nextProps.selectedRound
    const prevSelectedRound = this.props.selectedRound

    const selectedSeason = nextProps.season
    const prevSelectedSeason = this.props.season

    /**
     * SEASON SWITCH CASE
     */
    if (selectedSeason !== prevSelectedSeason) {
      dispatch(clearAdminTeams())
    }

    /**
     * ROUND SWITCHER
     */
    if (selectedRound !== prevSelectedRound) {
      dispatch(startGetAdminTeams(selectedRound._id))
    }

    return null
  }

  onDeleteDay(e, team) {
    e.stopPropagation()
    const { dispatch } = this.props
    if (team && team._id && confirm('You will lose all data of this team')) {
      dispatch(startDeleteTeam(team._id))
    }
  }

  onRoundSelect(e, round) {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch } = this.props
    dispatch(selectAdminRound(round))
    // dispatch(startGetAdminDays(round._id))
  }

  roundSelector() {
    const { selectedRound, rounds } = this.props
    if (rounds && rounds.length) {
      return rounds.map((round, i) => {
        let dinamicClass
        if (selectedRound) {
          dinamicClass = selectedRound._id === round._id ? 'active' : ''
        }
        return (
          <button key={i} onClick={(e) => this.onRoundSelect(e, round)} className={`btn btn-primary ${dinamicClass}`}>
            <b>{round.label}</b>
          </button>
        )
      })
    }
    return null
  }

  renderTeamsList() {
    const { teams } = this.props
    if (teams && teams.length) {
      /**
       * GENERATE LIST
       */
      return teams.map((team, i) => {
        return (
          <li className="item" key={i}>
            <div className="product-img round-host-img">
              <img src="" role="presentation" />
            </div>
            <div className="product-info day-info">
              <span className="label label-danger pull-right">
                <i className="fa fa-remove fa-2x" onClick={(e) => this.onDeleteDay(e, team)}></i>
              </span>
              <span className="product-title">
                <Link to={`/admin/team/${team._id}`}>
                  {team.name}
                </Link>
              </span>
              <span className="product-description">
                more info
              </span>
            </div>
          </li>
        )
      })
    }
    return (
      <p>
        No team found in this round!
      </p>
    )
  }

  render() {
    return (
      <Box title="Team list">
        <br />
        <div className="btn-group">
          {this.roundSelector()}
        </div>
        <hr />
        <ul className="products-list product-list-in-box">
          {this.renderTeamsList()}
        </ul>
      </Box>
    )
  }
}

TeamsList.propTypes = {
  selectedRound: React.PropTypes.object,
  rounds: React.PropTypes.array,
  teams: React.PropTypes.array,
  season: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default TeamsList
