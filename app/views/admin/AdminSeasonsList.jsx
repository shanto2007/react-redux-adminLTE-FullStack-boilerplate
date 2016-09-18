import React from 'react'
import { connect } from 'react-redux'
import Box from 'Box'
import { startGetAdminSeasons, startCreateNewSeason, startDeleteSeason, startSetCurrentSeason } from 'actions'

class AdminSeasonsList extends React.Component {
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

  onSetCurrentHandler(e, seasonId) {
    const { dispatch } = this.props
    if (seasonId && confirm('Do you really want to set this season as the current one?')) {
      dispatch(startSetCurrentSeason(seasonId))
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
            <div className="pull-left bold" style={{ fontSize: '3rem', lineHeight: '6rem' }}>
              {season.year}
            </div>
            <div className="pull-right">
              <a className={`btn btn-app ${season.current ? 'hide' : ''}`} onClick={(e) => this.onSetCurrentHandler(e, season._id)}>
                <i className="fa fa-thumb-tack fa-2x"></i>
                Set Current
              </a>
              <a className="btn btn-app" onClick={(e) => this.onDeleteHandler(e, season._id)}>
                <i className="fa fa-remove fa-2x" style={{ color: 'red', cursor: 'pointer' }}></i>
                Remove
              </a>
            </div>
            <hr />
          </div>
        )
      })
    }
    return null
  }

  render() {
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

AdminSeasonsList.propTypes = {
  dispatch: React.PropTypes.func,
  seasons: React.PropTypes.object,
}

export default connect((state) => ({
  seasons: state.seasons,
}))(AdminSeasonsList)
