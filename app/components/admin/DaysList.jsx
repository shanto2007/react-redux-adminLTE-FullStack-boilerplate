import React from 'react'
import Box from 'Box'
import RoundSwitcher from 'RoundSwitcher'
import {
  startGetAdminDays,
  startDeleteDay,
} from 'actions'

class DaysList extends React.Component {
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
      dispatch(startGetAdminDays(selectedRound._id))
    }
    return null
  }

  onDeleteDay(e, day) {
    e.stopPropagation()
    const { dispatch } = this.props
    if (day && day._id && confirm('You will lose all data of this days')) {
      dispatch(startDeleteDay(day._id))
    }
  }

  renderDaysList() {
    const { days } = this.props.days
    console.log(days)
    if (days && days.length) {
      /**
       * GENERATE LIST
       */
      return days.map((day, i) => {
        return (
          <li className="item" key={i}>
            <div className="product-info day-info">
              <span className="label label-danger pull-right">
                <i className="fa fa-remove fa-2x" onClick={(e) => this.onDeleteDay(e, day)}></i>
              </span>
              <span className="product-title">
                <b>{i + 1}</b>
              </span>
              {/* <span className="product-title">
                more info
              </span> */}
            </div>
          </li>
        )
      })
    }
    return (
      <p>
        No days yet!
      </p>
    )
  }

  render() {
    return (
      <Box title="Days List" subtitle={`Season: ${this.props.season.year}`} filters={<RoundSwitcher />}>
        <ul className="products-list product-list-in-box">
          {this.renderDaysList()}
        </ul>
      </Box>
    )
  }
}

DaysList.propTypes = {
  selectedRound: React.PropTypes.object,
  rounds: React.PropTypes.array,
  season: React.PropTypes.object,
  days: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default DaysList
