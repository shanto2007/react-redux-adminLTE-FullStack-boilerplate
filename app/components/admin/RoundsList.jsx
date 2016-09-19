import React from 'react'
import { connect } from 'react-redux'
import Box from 'Box'
import { startGetAdminRounds, startDeleteRound } from 'actions'

class RoundsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewedSeason: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    const season = nextProps.season
    // GET first data and refresh data if season is switched in the topbar
    if (season._id && season._id !== this.state.viewedSeason) {
      dispatch(startGetAdminRounds(season._id))
      this.setState({
        viewedSeason: season._id,
      })
    }
  }

  onDeleteRound(e, round) {
    e.stopPropagation()
    const { dispatch } = this.props
    if (round && round._id && confirm('You will lose all data of this rounds')) {
      // TODO CASCADE DELETE ON SERVER
      dispatch(startDeleteRound(round._id))
    }
  }

  renderRoundList() {
    const { rounds } = this.props.rounds
    if (rounds && rounds.length) {
      /**
       * SORT BY LABEL
       */
      const sortedByRoundLabel = rounds.sort((a, b) => {
        if (a.label > b.label) {
          return 1
        }
        if (a.label < b.label) {
          return -1
        }
        return 0
      })
      /**
       * GENERATE LIST
       */
      return sortedByRoundLabel.map((round, i) => {
        let host = null, season = null
        if (round.host.length) {
          host = (
            <span className="product-description">
              <b>Host: </b> {round.host}
            </span>
          )
        }
        if (round.season.year) {
          season = (
            <span className="product-description">
              <b>Season: </b> {round.season.year}
            </span>
          )
        }
        return (
          <li className="item" key={i}>
            <div className="product-img round-host-img">
              <img src="dist/img/default-50x50.gif" role="presentation" />
            </div>
            <div className="product-info round-info">
              <span className="label label-danger pull-right">
                <i className="fa fa-remove fa-2x" onClick={(e) => this.onDeleteRound(e, round)}></i>
              </span>
              <span className="product-title">
                <b>Round: </b> {round.label}
              </span>
              {host}
              {season}
            </div>
          </li>
        )
      })
    }
    return (
      <p>
        No Round created yet!
      </p>
    )
  }


  render() {
    return (
      <Box title="Rounds list">
        <ul className="products-list product-list-in-box">
          {this.renderRoundList()}
        </ul>
      </Box>
    )
  }
}

RoundsList.propTypes = {
  season: React.PropTypes.object,
  rounds: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default connect((state) => ({
  season: state.seasons.viewed,
  rounds: state.rounds,
}))(RoundsList)
