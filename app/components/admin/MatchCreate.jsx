import React from 'react'
import Box from 'Box'
import { startCreateNewTeam } from 'actions'

class MatchCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      round: '',
      name: '',
    }
  }

  onRoundChange(e) {
    e.stopPropagation()
    const round = e.target.value
    if (round) {
      this.setState({ round })
    }
  }

  onTeamNameChange(e) {
    e.stopPropagation()
    const name = e.target.value
    this.setState({ name })
  }

  onCreateRound(e) {
    e.stopPropagation()
    e.preventDefault()
    const { dispatch } = this.props
    const newTeam = {}
    newTeam.name = this.state.name
    newTeam.round = this.state.round
    newTeam.season = this.props.season._id
    dispatch(startCreateNewTeam(newTeam))
  }

  generateLabelsList() {
    const { rounds } = this.props
    return rounds.map((c, i) => {
      return (
        <option value={c._id} key={i}>{c.label}</option>
      )
    })
  }

  render() {
    return (
      <Box title="Create Team">
        <form onSubmit={(e) => this.onCreateRound(e)}>
          <div className="col-sm-12 col-md-9">
            <input className="form-control" placeholder="Team name" onChange={(e) => this.onTeamNameChange(e)} />
          </div>
          <div className="col-sm-12 col-md-3">
            <select className="form-control" defaultValue="0" onChange={(e) => this.onRoundChange(e)}>
              <option value="0" disabled>Team Round</option>
              { this.generateLabelsList() }
            </select>
          </div>
          <div className="clearfix"></div>
          <div className="submit-box">
            <button
              type="submit"
              className="btn btn-primary pull-right"
              disabled={!this.state.round.length || !this.state.name.length}
            >
              Create New Round
            </button>
          </div>
          <div className="clearfix"></div>
        </form>
      </Box>
    )
  }
}

MatchCreate.propTypes = {
  dispatch: React.PropTypes.func,
  season: React.PropTypes.object,
  rounds: React.PropTypes.array,
}

export default MatchCreate
