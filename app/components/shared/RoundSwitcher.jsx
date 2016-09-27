import React from 'react'
import { connect } from 'react-redux'
import { selectAdminRound } from 'actions'

class RoundSwitcher extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(selectAdminRound(null))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(selectAdminRound(null))
  }

  onRoundSelect(e, round) {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch } = this.props
    dispatch(selectAdminRound(round))
  }
  roundSelector() {
    const { selectedRound, rounds } = this.props.rounds
    if (rounds && rounds.length) {
      return rounds.map((round, i) => {
        let dinamicClass
        if (selectedRound) {
          dinamicClass = selectedRound._id === round._id ? 'active' : ''
        }
        return (
          <button key={i} onClick={(e) => this.onRoundSelect(e, round)} className={`btn btn-primary ${dinamicClass}`}>
            <b>{round.label}</b>
          </button>
        )
      })
    }
    return (
      <div className="callout callout-danger">
        <h4>No Round created yet!</h4>
        <p>
          No Roudn created for your torunament, create some in the round section!
        </p>
      </div>
    )
  }
  render() {
    return (
      <div className="round-selector clearfix ">
        <label htmlFor="round-selector">Select a round</label>
        {this.roundSelector()}
      </div>
    )
  }
}

RoundSwitcher.propTypes = {
  dispatch: React.PropTypes.func,
  rounds: React.PropTypes.object,
}

export default connect((state) => ({
  rounds: state.rounds,
}))(RoundSwitcher)
