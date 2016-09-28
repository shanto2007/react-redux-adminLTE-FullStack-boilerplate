import React from 'react'
import Box from 'Box'
import RoundSwitcher from 'RoundSwitcher'
import {
  startGetAdminMatches,
} from 'actions'

class MatchesList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    const selectedRound = nextProps.selectedRound
    const prevSelectedRound = this.props.selectedRound

    /**
     * ROUND SWITCHER
     */
    if (selectedRound && selectedRound !== prevSelectedRound) {
      dispatch(startGetAdminMatches(selectedRound._id))
    }
    return null
  }

  // onDeleteDay(e, day) {
  //   e.stopPropagation()
  //   const { dispatch } = this.props
  //   if (day && day._id && confirm('You will lose all data of this days')) {
  //     dispatch(startDeleteDay(day._id))
  //   }
  // }

  // renderMatchesList() {
  //   const { days } = this.props.days
  //   if (days && days.length) {
  //     /**
  //      * GENERATE LIST
  //      */
  //     return days.map((day, i) => {
  //       return (
  //         <li className="item" key={i}>
  //           <div className="product-info day-info">
  //             <span className="label label-danger pull-right">
  //               <i className="fa fa-remove fa-2x" onClick={(e) => this.onDeleteDay(e, day)}></i>
  //             </span>
  //             <span className="product-title">
  //               <b>Day: </b> {i}
  //             </span>
  //             <span className="product-title">
  //               more info
  //             </span>
  //           </div>
  //         </li>
  //       )
  //     })
  //   }
  //   return (
  //     <p>
  //       No days created, yet!
  //     </p>
  //   )
  // }

  render() {
    return (
      <Box title="Matches list" filters={<RoundSwitcher />}>
        {JSON.stringify(this.props)}
      </Box>
    )
  }
}

MatchesList.propTypes = {
  selectedRound: React.PropTypes.object,
  matches: React.PropTypes.array,
  dispatch: React.PropTypes.func,
}

export default MatchesList
