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

  // componentDidUpdate(prevProps) {
  //   const { dispatch } = this.props
  //   const viewedSeason = this.props.season
  //   if (!prevProps.season && viewedSeason) {
  //     dispatch(startGetAdminRounds(viewedSeason._id))
  //   }
  // }

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
