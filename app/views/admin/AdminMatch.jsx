import React from 'react'
import { connect } from 'react-redux'
import {
  startGetAdminSingleMatch,
  startEditAdminMatch,
} from 'actions'

import Box from 'Box'

const blackBase64Gif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

require('!style!css!sass!app/styles/admin/match-edit.scss')

class AdminMatch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const { id } = this.props.params
    const { dispatch } = this.props
    if (id) {
      dispatch(startGetAdminSingleMatch(id))
    }
    return null
  }

  componentWillReceiveProps(nextProps) {
    const { match } = this.props
    const nextMatch = nextProps.match
    const statePlayers = {}
    if (match && match !== nextMatch) {
      /**
       * SET PLAYERS
       */
      nextMatch.teamHome.players.forEach((player) => {
        statePlayers[player._id] = player
        statePlayers[player._id].scored = 0
        statePlayers[player._id].warned = false
        statePlayers[player._id].expelled = false
        statePlayers[player._id].attended = false
      })
      nextMatch.teamAway.players.forEach((player) => {
        statePlayers[player._id] = player
        statePlayers[player._id].scored = 0
        statePlayers[player._id].warned = false
        statePlayers[player._id].expelled = false
        statePlayers[player._id].attended = false
      })
      /**
       * SET PLAYERS SCORES DATA
       */
      nextMatch.scores.forEach((score) => {
        statePlayers[score.player].scored += 1
      })
      nextMatch.attendances.forEach((attend) => {
        statePlayers[attend.player].attended = true
      })
      nextMatch.warns.forEach((warn) => {
        statePlayers[warn.player].warned = true
      })
      nextMatch.expulsions.forEach((expulsion) => {
        statePlayers[expulsion.player].expelled = true
      })
      this.setState(statePlayers)
    }
    return null
  }

  onPlayerAttendanceChange(e, player) {
    e.stopPropagation()
    const playerUpdate = this.state[player._id]
    playerUpdate.attended = e.target.checked
    this.setState({
      [player._id]: playerUpdate,
    })
  }

  onPlayerScoreChange(e, player) {
    e.stopPropagation()
    const playerUpdate = this.state[player._id]
    playerUpdate.scored = Number(e.target.value) >= 0 ? Number(e.target.value) : 0
    playerUpdate.attended = Number(e.target.value) > 0
    this.setState({
      [player._id]: playerUpdate,
    })
  }

  onPlayerPenaltyChange(e, player) {
    e.stopPropagation()
    const playerUpdate = this.state[player._id]
    switch (e.target.value) {
      case 'undefined':
        playerUpdate.warned = false
        playerUpdate.expelled = false
        return this.setState({
          [player._id]: playerUpdate,
        })
      case 'warned':
        playerUpdate.warned = true
        playerUpdate.expelled = false
        return this.setState({
          [player._id]: playerUpdate,
        })
      case 'expelled':
        playerUpdate.warned = false
        playerUpdate.expelled = true
        return this.setState({
          [player._id]: playerUpdate,
        })
      default:
        return null
    }
  }

  onMatchSave(e) {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch, match } = this.props
    const matchData = Object.keys(this.state).map((key) => this.state[key])
    if (matchData.length) {
      dispatch(startEditAdminMatch(match._id, matchData))
    }
  }

  defaultPenaltySelection(player) {
    if (player.warned) return 'warned'
    if (player.expelled) return 'expelled'
    return '0'
  }

  renderPlayerList(players) {
    if (players && players.length) {
      return players.map((player, i) => {
        return (
          <div className="match-player clearfix text-center" key={i}>
            <div className="col-sm-12 clearfix">
              {player.name}
            </div>
            <div className="col-sm-4 Attend">
              <input
                type="checkbox"
                checked={this.state[player._id].attended}
                onChange={(e) => this.onPlayerAttendanceChange(e, player)}
              />
            </div>
            <div className="col-sm-4 Scores">
              <input
                type="number"
                className="form-control"
                value={this.state[player._id].scored}
                onChange={(e) => this.onPlayerScoreChange(e, player)}
              />
            </div>
            <div className="col-sm-4 Penalty">
              <select
                defaultValue={this.defaultPenaltySelection(player)}
                className="form-control"
                onChange={(e) => this.onPlayerPenaltyChange(e, player)}
              >
                <option value="0" disabled>Penalty</option>
                <option value="warned">Warning</option>
                <option value="expelled">Expulsion</option>
                <option value="undefined">No Penalty</option>
              </select>
            </div>
          </div>
        )
      })
    }
    return null
  }

  render() {
    const { match } = this.props
    if (match._id) {
      const teamHomePlayers = match.teamHome.players
      const teamAwayPlayers = match.teamAway.players
      return (
        <div id="admin-single-match">
          <Box title="Match Overview">
            <div className="match-overview text-center">
              <div className="col-sm-4 match-team-avatar">
                <div><img src={match.teamHome.avatar ? match.teamHome.avatar.thumbnail : blackBase64Gif} /></div>
              </div>
              <div className="col-sm-4 match-score">
                {match.teamHomeScores} - {match.teamAwayScores}
              </div>
              <div className="col-sm-4 match-team-avatar">
                <div><img src={match.teamAway.avatar ? match.teamAway.avatar.thumbnail : blackBase64Gif} /></div>
              </div>
            </div>
          </Box>
          <div className="col-sm-12 col-md-6 ">
            <Box title={match.teamHome.name}>
              <div className="match-player-list">
                {this.renderPlayerList(teamHomePlayers)}
              </div>
            </Box>
          </div>
          <div className="col-sm-12 col-md-6">
            <Box title={match.teamAway.name}>
              <div className="match-player-list">
                {this.renderPlayerList(teamAwayPlayers)}
              </div>
            </Box>
          </div>
          <div className="clearfix"></div>
          <button className="btn btn-primary btn-block" onClick={(e) => this.onMatchSave(e)}>Save</button>
        </div>
      )
    }
    return null
  }
}

AdminMatch.propTypes = {
  dispatch: React.PropTypes.func,
  match: React.PropTypes.object,
  params: React.PropTypes.object,
}

export default connect((state) => ({
  match: state.match.match,
}))(AdminMatch)
