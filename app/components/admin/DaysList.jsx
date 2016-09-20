import React from 'react'
import Box from 'Box'
import { connect } from 'react-redux'
import { startGetAdminDays, startDeleteRound, clearAdminDays } from 'actions'

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
  // componentWillReceiveProps(nextProps) {
  //   const { dispatch } = this.props
  //   const newSeason = nextProps.season
  //   const prevSeason = this.props.season
  //   // GET first data and refresh data if season is switched in the topbar
  //   if (newSeason !== prevSeason && !prevSeason) {
  //     return dispatch(startGetAdminRounds(newSeason._id))
  //   }
  //   return null
  // }

  // onDeleteRound(e, round) {
  //   e.stopPropagation()
  //   const { dispatch } = this.props
  //   if (round && round._id && confirm('You will lose all data of this rounds')) {
  //     dispatch(startDeleteRound(round._id))
  //   }
  // }

  renderDaysList() {
    const { days } = this.props
    if (days && days.length) {
      /**
       * GENERATE LIST
       */
      return days.map((day, i) => {
        let host = null, season = null
        // if (day.host.length) {
        //   host = (
        //     <span className="product-description">
        //       <b>Host: </b> {day.host}
        //     </span>
        //   )
        // }
        // if (day.season.year) {
        //   season = (
        //     <span className="product-description">
        //       <b>Season: </b> {day.season.year}
        //     </span>
        //   )
        // }
        return (
          <li className="item" key={i}>
            <div className="product-info round-info">
              <span className="label label-danger pull-right">
                <i className="fa fa-remove fa-2x" onClick={(e) => this.onDeleteRound(e, round)}></i>
              </span>
              <span className="product-title">
                <b>Day </b> {i}
              </span>
              {/* {host}
              {season} */}
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

  roundSelector() {
    const { rounds } = this.props
    if (rounds) {
      return rounds.map((round, i) => {
        return (<button key={i} className="btn btn-default">{round.label}</button>)
      })
    }

  }

  render() {
    return (
      <Box title="Rounds list">
        {JSON.stringify(this.props.days)}
        <br />
        <div className="btn-group">
          <button disabled className="btn btn-default">Select Round</button>
          {this.roundSelector()}
        </div>
        <hr />
        <ul className="products-list product-list-in-box">
          {/* {this.renderDaysList()} */}
        </ul>
      </Box>
    )
  }
}

RoundsList.propTypes = {
  season: React.PropTypes.object,
  rounds: React.PropTypes.array,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  season: state.seasons.viewed,
  rounds: state.rounds.rounds,
  days: state.days.days,
}))(RoundsList)
