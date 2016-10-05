import React from 'react'
import { Link } from 'react-router'
import Box from 'Box'
import RoundSwitcher from 'RoundSwitcher'
import {
  startGetAdminTeams,
  startDeleteTeam,
} from 'actions'

class TeamsList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    const selectedRound = nextProps.selectedRound
    const prevSelectedRound = this.props.selectedRound
    /**
     * ROUND SWITCHER
     */
    if (selectedRound && selectedRound !== prevSelectedRound) {
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

  renderTeamsList() {
    const { teams } = this.props
    if (teams && teams.length) {
      /**
       * GENERATE LIST
       */
      return teams.map((team, i) => {
        let TeamAvatar = <i className="fa fa-users" style={{ fontSize: '2rem', lineHeight: '4rem' }}></i>
        if (team.avatar) {
          TeamAvatar = <img src={team.avatar.thumbnail} role="presentation" />
        }
        return (
          <li className="item" key={i}>
            <div className="product-img round-host-img text-center">
              {TeamAvatar}
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
                Wins: {team.wins} | Draws: {team.draws} | Losts: {team.losts}
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
      <Box title="Teams List" subtitle={`Season: ${this.props.season.year}`} filters={<RoundSwitcher />}>
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
