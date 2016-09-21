import React from 'react'
import Box from 'Box'
import { startCreateNewRounds } from 'actions'

class RoundCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      host: null,
      label: null,
    }
  }

  onLabelChange(e) {
    e.stopPropagation()
    const label = e.target.value
    if (label) {
      this.setState({ label })
    }
  }

  onHostChange(e) {
    e.stopPropagation()
    const host = e.target.value
    this.setState({ host })
  }

  onCreateRound(e) {
    e.stopPropagation()
    e.preventDefault()
    const { dispatch } = this.props
    const newRound = {}
    newRound.label = this.state.label
    if (this.state.host) {
      newRound.host = this.state.host
    }
    newRound.season = this.props.season._id
    dispatch(startCreateNewRounds(newRound))
  }

  generateLabelsList() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return alphabet.split('').map((c, i) => {
      return (
        <option value={c} key={i}>{c}</option>
      )
    })
  }

  render() {
    return (
      <Box title="Create Team">
        <form onSubmit={(e) => this.onCreateRound(e)}>
          <div className="col-sm-12 col-md-9">
            <input className="form-control" placeholder="Round Host/Sponsor (optional)" onChange={(e) => this.onHostChange(e)} />
          </div>
          <div className="col-sm-12 col-md-3">
            <select className="form-control" defaultValue="0" onChange={(e) => this.onLabelChange(e)}>
              <option value="0" disabled>Select a label</option>
              { this.generateLabelsList() }
            </select>
          </div>
          <div className="clearfix"></div>
          <div className="submit-box">
            <button type="submit" className="btn btn-primary pull-right" disabled={!this.state.label}>Create New Round</button>
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
