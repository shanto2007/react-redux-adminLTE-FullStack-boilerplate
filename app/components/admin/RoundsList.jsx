import React from 'react'
import { connect } from 'react-redux'
import Box from 'Box'
// import { startGetAdminRounds } from 'actions'

class RoundsList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Box title="Rounds list">
        List
      </Box>
    )
  }
}

RoundsList.propTypes = {
  season: React.PropTypes.object,
  rounds: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  season: state.seasons.viewed,
  rounds: state.rounds,
}))(RoundsList)
