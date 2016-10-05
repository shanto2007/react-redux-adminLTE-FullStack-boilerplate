import React from 'react'
import Box from 'Box'
import { startCreateNewTeam } from 'actions'

class TeamCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      round: undefined,
      name: undefined,
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

  onCreateTeam(e) {
    e.stopPropagation()
    e.preventDefault()
    const { dispatch } = this.props
    const newTeam = {}
    newTeam.name = this.state.name
    newTeam.round = this.state.round
    newTeam.season = this.props.season._id
    dispatch(startCreateNewTeam(newTeam)).then(() => {
      this.setState({
        round: undefined,
        name: undefined,
      })
    })
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
    const { season } = this.props
    return (
      <Box title="Create a team" subtitle={`Season: ${season.year}`} >
        <form onSubmit={(e) => this.onCreateTeam(e)}>
          <div className="col-sm-12 col-md-9">
            <input className="form-control" placeholder="Team name" value={this.state.name || ''} onChange={(e) => this.onTeamNameChange(e)} />
          </div>
          <div className="col-sm-12 col-md-3">
            <select className="form-control" value={this.state.round || "0"} onChange={(e) => this.onRoundChange(e)}>
              <option value="0" disabled>Team Round</option>
              { this.generateLabelsList() }
            </select>
          </div>
          <div className="clearfix"></div>
          <div className="submit-box">
            <button
              type="submit"
              className="btn btn-primary pull-right"
              disabled={(this.state.round && this.state.name) && (!this.state.round.length || !this.state.name.length)}
            >
              Create New Team
            </button>
          </div>
          <div className="clearfix"></div>
        </form>
      </Box>
    )
  }
}

TeamCreate.propTypes = {
  dispatch: React.PropTypes.func,
  season: React.PropTypes.object,
  rounds: React.PropTypes.array,
}

export default TeamCreate
