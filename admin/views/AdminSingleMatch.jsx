import React from 'react'
import { connect } from 'react-redux'
import { MomentLoader } from 'ChunkLoaders'
import {
  startGetAdminSingleMatch,
  startEditAdminMatch,
  startResetAdminMatch,
} from 'actions'

import Box from 'Box'

const blackBase64Gif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

require('!style!css!sass!../styles/admin/match-edit.scss')

class AdminSingleMatch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    MomentLoader().then((module) => {
      this.setState({
        Moment: module.Moment,
      })
    })
    const { id } = this.props.params
    const { dispatch } = this.props
    if (id) {
      dispatch(startGetAdminSingleMatch(id))
    }
    return null
  }

  // FIXME: O(n) better loop plz
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
    /**
     * O(n*3) Hipster concatenation ahead, should FIXME: performance
     * - Get an array of keys of this comp state, which are player indexBySeason
     * - Filter to get an array of keys without Moment constructor that's get loaded async
     * - Finally get an array of a data that the server can digest.
     */
    const matchData = Object.keys(this.state).filter(key => key !== 'Moment').map((key) => this.state[key])
    if (matchData.length) {
      dispatch(startEditAdminMatch(match._id, matchData))
    }
  }

  onMatchReset(e) {
    e.stopPropagation()
    e.preventDefault()
    const { match, dispatch } = this.props
    if (match && match._id && confirm('Do you want to reset the match data? Warn: can\'t be undone.')) {
      dispatch(startResetAdminMatch(match._id))
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
        if (!this.state[player._id]) {
          return null
        }
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
    const { Moment } = this.state
    if (match._id && Moment) {
      const teamHomePlayers = match.teamHome.players
      const teamAwayPlayers = match.teamAway.players
      return (
        <div id="admin-single-match">
          <Box title="Match Overview">
            <div className="match-overview text-center">
              <div className="col-sm-4 match-team-avatar">
                <div> <img src={match.teamHome.avatar ? match.teamHome.avatar.thumbnail : blackBase64Gif} role="presentation" /> </div>
              </div>
              <div className="col-sm-4 match-score">
                {match.teamHomeScores} - {match.teamAwayScores}
              </div>
              <div className="col-sm-4 match-team-avatar">
                <div><img src={match.teamAway.avatar ? match.teamAway.avatar.thumbnail : blackBase64Gif} role="presentation" /></div>
              </div>
              <div className="clearfix"></div>
              <div className="box-footer">
                <div className="row">
                  <div className="col-sm-12 col-md-6 border-right">
                    <div className="description-block">
                      <h5 className="description-header">{Moment(match.date).format('lll')}</h5>
                      <span className="description-text">
                        <i className="fa fa-cog pointer fa-2x"></i>
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 border-right">
                    <div className="description-block">
                      <button className="btn btn-flat btn-danger reset-button" onClick={(e) => this.onMatchReset(e)}>Reset</button>
                    </div>
                  </div>
                </div>
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

AdminSingleMatch.propTypes = {
  dispatch: React.PropTypes.func,
  match: React.PropTypes.object,
  params: React.PropTypes.object,
  modules: React.PropTypes.object,
}

export default connect((state) => ({
  match: state.match.match,
}))(AdminSingleMatch)
