import React from 'react'

/**
 * COMPs
 */
import DayCreate from 'DayCreate'
import DaysList from 'DaysList'

class AdminDays extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <DayCreate />
        <DaysList />
      </div>
    )
  }
}

export default AdminDays
