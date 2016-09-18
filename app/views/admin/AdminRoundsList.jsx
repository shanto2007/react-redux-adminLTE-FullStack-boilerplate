import React from 'react'
import { connect } from 'react-redux'
import Box from 'Box'
import { startGetAdminRounds } from 'actions'

class AdminRoundsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      host: null,
      label: null,
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props
    const viewedSeason = this.props.season
    if (!prevProps.season && viewedSeason) {
      dispatch(startGetAdminRounds(viewedSeason._id))
    }
  }

  generateLabelsList() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    return alphabet.map((c, i) => {
      return (
        <option value={c} key={i}>{c}</option>
      )
    })
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
    if (host) {
      this.setState({ host })
    }
  }

  onCreateRound(e) {
    e.stopPropagation()
    e.preventDefault()
    // TODO CREATE NOW I GO TO DINNER :))
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <Box loading={this.props.rounds.loading} title="Create Round">
          <form onSubmit={(e) => this.onCreateRound(e)}>
            <input className="form-control" placeholder="Round Host/Sponsor (optional)" onChange={(e) => this.onHostChange(e)} />
            <select className="form-control" defaultValue="0" onChange={(e) => this.onLabelChange(e)}>
              <option value="0" disabled>Select a label</option>
              { this.generateLabelsList() }
            </select>
            <div className="submit-box">
              <button type="submit" className="btn btn-primary pull-right" disabled={!this.state.label}>Create New Round</button>
            </div>
            <div className="clearfix"></div>
          </form>
        </Box>
        <Box loading={this.props.rounds.loading} title="Rounds list">

        </Box>
      </div>
    )
  }
}

AdminRoundsList.propTypes = {
  dispatch: React.PropTypes.func,
  rounds: React.PropTypes.object,
}

export default connect((state) => ({
  rounds: state.rounds,
  season: state.seasons.viewed,
}))(AdminRoundsList)
