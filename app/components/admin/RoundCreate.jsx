import React from 'react'
import { connect } from 'react-redux'
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
    const { rounds } = this.props
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    /**
     * GENERATE USABLE LIST OF LABELS
     */
    if (rounds.length) {
      // get existing round label and split join in string in format A|B|C
      let existingRoundsRegExp = rounds.map((r) => {
        return r.label
      }).join('|')
      // GENERATED CAPTURE GROUP WITH THE JOINs
      existingRoundsRegExp = `(${existingRoundsRegExp})`
      // REPLACE THE EXISTING ROUND IN THE ALPHABET
      alphabet = alphabet.replace(new RegExp(existingRoundsRegExp, 'g'), '')
    }
    // GENERATE THE USABLE LABEL CHOICE
    return alphabet.split('').map((c, i) => {
      return (
        <option value={c} key={i}>{c}</option>
      )
    })
  }

  render() {
    const { season } = this.props
    return (
      <Box title="Create Round" overlay={season ? null : 'Select a season to edit in the topbar!'}>
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

export default connect((state) => ({
  season: state.seasons.viewed,
  rounds: state.rounds.rounds,
}))(RoundCreate)
