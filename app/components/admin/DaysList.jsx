import React from 'react'
import Box from 'Box'
import { connect } from 'react-redux'
import { startGetAdminDays, startDeleteDay, selectAdminRound } from 'actions'

class RoundsList extends React.Component {
  constructor(props) {
    super(props)
  }

  // componentWillMount() {
  //   const { season, dispatch } = this.props
  //   if (season) {
  //     dispatch(startGetAdminDays(season._id))
  //   } else {
  //     dispatch(clearAdminDays())
  //   }
  // }
  //
  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    const selectedRound = nextProps.rounds.selected
    const prevSelectedRound = this.props.rounds.selected
    // GET first data and refresh data if season is switched in the topbar
    if (selectedRound !== prevSelectedRound && !prevSelectedRound) {
      return dispatch(startGetAdminDays(selectedRound._id))
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
    const { rounds } = this.props.rounds
    if (rounds && rounds.length) {
      return rounds.map((round, i) => {
        return (<button key={i} onClick={(e) => this.onRoundSelect(e, round)} className="btn btn-default">{round.label}</button>)
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
        No Day created yet!
      </p>
    )
  }

  render() {
    const { days, rounds } = this.props
    if (rounds.rounds.length) {
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
    return null
  }
}

RoundsList.propTypes = {
  season: React.PropTypes.object,
  rounds: React.PropTypes.object,
  days: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  season: state.seasons.viewed,
  rounds: state.rounds,
  days: state.days,
}))(RoundsList)
