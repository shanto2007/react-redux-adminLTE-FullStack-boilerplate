import React from 'react'

class AdminMatch extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log(this.props.params)
    return <h1>Single Match</h1>
  }
}

AdminMatch.propTypes = {
  myProps: React.PropTypes.string,
}

export default AdminMatch
