import React from 'react'
import { connect } from 'react-redux'
import Box from 'Box'
import { startGetAdminSeasons, startCreateNewSeason, startDeleteSeason } from 'actions'

class SeasonsList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedYear: null,
    }

    this.newSeasonHandler.bind(this)
    this.renderSeasonList.bind(this)
    this.onDeleteHandler.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(startGetAdminSeasons())
  }

  onDeleteHandler(e, seasonId) {
    const { dispatch } = this.props
    if (seasonId && confirm('Do you really want to delete this season?')) {
      dispatch(startDeleteSeason(seasonId))
    }
  }

  newSeasonHandler(e) {
    e.preventDefault()
    const { selectedYear } = this.state
    const { dispatch } = this.props
    if (selectedYear) {
      dispatch(startCreateNewSeason(selectedYear))
    }
  }

  selectChangeHandler(e) {
    const selectedYear = e.target.value
    this.setState({
      selectedYear,
    })
    e.target.value = selectedYear
  }

  renderYearsList() {
    const years = []
    const currentYear = new Date().getFullYear()
    for (let i = currentYear; i < currentYear + 10; i++) {
      years.push(i)
    }
    return years.map((e, i) => {
      return (<option key={i} value={e}>{e}</option>)
    })
  }

  renderSeasonList() {
    const { seasons } = this.props.seasons
    if (seasons) {
      return seasons.map((season, i) => {
        return (
          <div className="col-sm-12 clearfix" key={i}>
            <div className="pull-left bold" style={{ fontSize: '2rem' }}>
              {season.year}
            </div>
            <div className="pull-right">
              <i onClick={(e) => this.onDeleteHandler(e, season._id)} className="fa fa-remove fa-2x" style={{ color: 'red', cursor: 'pointer' }}></i>
            </div>
            <hr />
          </div>
        )
      })
    }
    return null
  }

  render() {
    console.log(this.props.seasons.seasons)
    return (
      <div>
        <Box loading={this.props.seasons.loading} title="Create Seasons">
          <form onSubmit={(e) => this.newSeasonHandler(e)}>
            <select className="form-control" onChange={(e) => this.selectChangeHandler(e)} defaultValue="0">
              <option value="0" disabled>Select an year</option>
              {this.renderYearsList()}
            </select>
            <div className="submit-box">
              <button type="submit" className="btn btn-primary pull-right" disabled={!this.state.selectedYear}>Create New Season</button>
            </div>
            <div className="clearfix"></div>
          </form>
        </Box>
        <hr />
        <Box loading={this.props.seasons.loading} title="Seasons list">
          { this.renderSeasonList() }
        </Box>
      </div>
    )
  }
}

SeasonsList.propTypes = {
  dispatch: React.PropTypes.func,
  seasons: React.PropTypes.object,
}

export default connect((state) => ({
  seasons: state.seasonAdmin,
}))(SeasonsList)
