import React from 'react'
import { connect } from 'react-redux'
import { startGetAdminSingleMatch } from 'actions'

class AdminMatch extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { id } = this.props.params
    const { dispatch } = this.props
    if (id) {
      dispatch(startGetAdminSingleMatch(id))
    }
  }

  render() {
    return <pre>{JSON.stringify(this.props.match || {})}</pre>
  }
}

AdminMatch.propTypes = {
  dispatch: React.PropTypes.func,
  match: React.PropTypes.object,
  params: React.PropTypes.object,
}

export default connect((state) => ({
  match: state.match.match,
}))(AdminMatch)
