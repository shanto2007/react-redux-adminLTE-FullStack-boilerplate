import React from 'react'
import Box from 'Box'
import { startCreateNewDay } from 'actions'

class RoundCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      round: null,
    }
  }

  onRoundSelect(e) {
    e.stopPropagation()
    const round = e.target.value
    if (round) {
      this.setState({ round })
    }
  }

  onCreateRound(e) {
    e.stopPropagation()
    e.preventDefault()
    const { dispatch } = this.props
    const newDay = {}
    newDay.round = this.state.round
    newDay.season = this.props.season._id
    dispatch(startCreateNewDay(newDay))
  }

  generateRoundList() {
    const { rounds } = this.props
    return rounds.map((round, i) => {
      return (
        <option value={round._id} key={i}>{round.label}</option>
      )
    })
  }

  render() {
    const { season } = this.props
    return (
      <Box title="Create Day" overlay={season ? null : 'Select a season to edit in the topbar!'}>
        <form onSubmit={(e) => this.onCreateRound(e)}>
          <select className="form-control" defaultValue="0" onChange={(e) => this.onRoundSelect(e)}>
            <option value="0" disabled>Select a round</option>
            { this.generateRoundList() }
          </select>
          <div className="submit-box">
            <button type="submit" className="btn btn-primary pull-right" disabled={!this.state.round}>Create New Day</button>
          </div>
          <div className="clearfix"></div>
        </form>
      </Box>
    )
  }
}

RoundCreate.propTypes = {
  dispatch: React.PropTypes.func,
  season: React.PropTypes.object,
  rounds: React.PropTypes.array,
}

export default RoundCreate
