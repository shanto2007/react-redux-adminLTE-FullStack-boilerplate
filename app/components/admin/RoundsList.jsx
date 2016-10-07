import React from 'react'
import Box from 'Box'
import RoundMediaUploader from 'RoundMediaUploader'
import { startGetAdminRounds, startDeleteRound, clearAdminRounds, startDeleteAdminRoundMedia } from 'actions'

require('!style!css!sass!app/styles/admin/rounds-list.scss')

class RoundsList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { season, dispatch } = this.props
    if (season) {
      dispatch(startGetAdminRounds(season._id))
    } else {
      dispatch(clearAdminRounds())
    }
  }

  onDeleteRound(e, round) {
    e.stopPropagation()
    const { dispatch } = this.props
    if (round && round._id && confirm('You will lose all data of this rounds')) {
      dispatch(startDeleteRound(round._id))
    }
  }

  onDeleteRoundMedia(e, round) {
    e.stopPropagation()
    const { dispatch } = this.props
    if (round && round._id && confirm('Do you want to remove the round media?')) {
      dispatch(startDeleteAdminRoundMedia(round._id))
    }
  }

  renderRoundList() {
    const { rounds } = this.props
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
        let media
        if (round.media) {
          media = (
            <div className="club-image-wrapper">
              <i
                className="fa fa-remove pointer remove-button"
                onClick={(e) => this.onDeleteRoundMedia(e, round)}
                data-toggle="tooltip"
                title="Remove Media"
              >
              </i>
              <img src={round.media.thumbnail || round.media.path} role="presentation" />
            </div>
          )
        } else {
          media = <RoundMediaUploader round={round} />
        }
        return (
          <li className="item" key={i}>
            <div className="product-img round-host-img">
              {media}
            </div>
            <div className="product-info round-info">
              <span className="label label-danger pull-right">
                <i
                  className="fa fa-remove fa-2x pointer"
                  data-toggle="tooltip"
                  title="Remove Round, can't be undone!"
                  onClick={(e) => this.onDeleteRound(e, round)}
                >
                </i>
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
    const { season } = this.props
    return (
      <Box title="Round list" subtitle={`Season: ${season.year}`} >
        <ul className="products-list product-list-in-box round-list">
          {this.renderRoundList()}
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

export default RoundsList
