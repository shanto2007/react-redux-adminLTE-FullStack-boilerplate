import React from 'react'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="container-fluid">
        <section className="content-header">
          <h1>
            Dashboard
            <small>Current Season Statistics</small>
          </h1>
          <br /><br />
        </section>
      </div>
    )
  }
}

Dashboard.propTypes = {
  dispatch: React.PropTypes.func,
}

export default Dashboard
