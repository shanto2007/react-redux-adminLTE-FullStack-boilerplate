import React from 'react'
import Box from 'Box'
import {
  startGetAdminDays,
  startDeleteDay,
  selectAdminRound,
  clearAdminDays,
} from 'actions'

class DaysList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props

    const selectedRound = nextProps.selectedRound
    const prevSelectedRound = this.props.selectedRound

    const selectedSeason = nextProps.season
    const prevSelectedSeason = this.props.season

    /**
     * SEASON SWITC CASE
     */
    if (selectedSeason !== prevSelectedSeason) {
      dispatch(clearAdminDays())
    }

    /**
     * ROUND SWITCHER
     */
    if (selectedRound !== prevSelectedRound) {
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

  onRoundSelect(e, round) {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch } = this.props
    dispatch(selectAdminRound(round))
    // dispatch(startGetAdminDays(round._id))
  }

  roundSelector() {
    const { selectedRound, rounds } = this.props
    if (rounds && rounds.length) {
      return rounds.map((round, i) => {
        let dinamicClass
        if (selectedRound) {
          dinamicClass = selectedRound._id === round._id ? 'active' : ''
        }
        return (
          <button key={i} onClick={(e) => this.onRoundSelect(e, round)} className={`btn btn-primary ${dinamicClass}`}>
            <b>{round.label}</b>
          </button>
        )
      })
    }
    return (
      <div className="callout callout-danger">
        <h4>No Round created yet!</h4>
        <p>
          No Roudn created for your torunament, create some in the round section!
        </p>
      </div>
    )
  }

  renderDaysList() {
    const { days } = this.props.days
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
                <b>Day: </b> {i}
              </span>
              <span className="product-title">
                more info
              </span>
            </div>
          </li>
        )
      })
    }
    return (
      <p>
        No days created, yet!
      </p>
    )
  }

  render() {
    const { days } = this.props
    return (
      <Box title="Days list" loading={days.loading}>
        <br />
        <div className="btn-group">
          {this.roundSelector()}
        </div>
        <hr />
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
