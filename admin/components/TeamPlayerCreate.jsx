import React from 'react'
import Box from 'Box'
import { startCreateNewPlayer } from 'actions'

class TeamPlayerCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      surname: '',
    }
  }

  onPlayerNameChange(e) {
    e.stopPropagation()
    const name = e.target.value
    this.setState({ name })
  }

  onPlayerSurnameChange(e) {
    e.stopPropagation()
    const surname = e.target.value
    this.setState({ surname })
  }


  onCreatePlayer(e) {
    e.stopPropagation()
    e.preventDefault()
    const { dispatch, team } = this.props
    const newPlayer = {}
    if (team) {
      newPlayer.name = this.state.name
      newPlayer.surname = this.state.surname
      newPlayer.team = team._id
      newPlayer.season = team.season._id
      newPlayer.round = team.round._id
      dispatch(startCreateNewPlayer(newPlayer))
    }
  }

  render() {
    return (
      // TODO MINIMAL VALIDATION
      <Box title="Add Player">
        <form onSubmit={(e) => this.onCreatePlayer(e)}>
          <div className="form-group">
            <input className="form-control" placeholder="Name *(required)" onChange={(e) => this.onPlayerNameChange(e)} />
          </div>
          <div className="form-group">
            <input className="form-control" placeholder="Surname *(required)" onChange={(e) => this.onPlayerSurnameChange(e)} />
          </div>
          <div className="submit-box">
            <button
              type="submit"
              className="btn btn-primary pull-right"
              disabled={!this.state.name.length || !this.state.surname.length}
            >
              Add player
            </button>
          </div>
        </form>
      </Box>
    )
  }
}

TeamPlayerCreate.propTypes = {
  dispatch: React.PropTypes.func,
  team: React.PropTypes.object,
}

export default TeamPlayerCreate
