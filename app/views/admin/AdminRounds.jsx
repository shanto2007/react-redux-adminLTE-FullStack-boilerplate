import React from 'react'

/**
 * COMPs
 */
import RoundCreate from 'RoundCreate'
import RoundsList from 'RoundsList'

class AdminRounds extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <RoundCreate />
        <RoundsList />
      </div>
    )
  }
}

export default AdminRounds
