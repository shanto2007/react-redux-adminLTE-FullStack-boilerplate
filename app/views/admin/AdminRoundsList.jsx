import React from 'react'
import { connect } from 'react-redux'
import Box from 'Box'

class AdminRoundsList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Box loading={this.props.rounds.loading} title="Rounds list">
          ROUNDS LIST
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
}))(AdminRoundsList)
