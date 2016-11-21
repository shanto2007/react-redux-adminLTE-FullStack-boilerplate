import React from 'react'
import { connect } from 'react-redux'

import { setSettings, startSaveSettings, startGetSettings } from 'actions/actions'
import Box from 'shared/Box'

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sitename: undefined,
      mailContact: undefined,
      joinAllowed: undefined,
    }
  }
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(startGetSettings())
  }

  componentWillReceiveProps(nextProps) {
    const { settings } = this.props.settings
    const newSettings = nextProps.settings.settings
    if (newSettings && newSettings !== settings) {
      const { sitename, mailContact, joinAllowed } = newSettings
      this.setState({
        sitename,
        mailContact,
        joinAllowed,
      })
    }
  }

  saveSettings() {
    const { sitename, mailContact, joinAllowed } = this.state
    const { dispatch } = this.props
    dispatch(setSettings({ sitename, mailContact, joinAllowed }))
    dispatch(startSaveSettings())
  }

  render() {
    const { sitename, mailContact, joinAllowed } = this.state
    if (typeof sitename !== 'undefined' && typeof mailContact !== 'undefined' && typeof joinAllowed !== 'undefined') {
      return (
        <Box title="Settings" loading={this.props.settings.loading}>
          <div id="settings-box">
            <input
              type="text"
              className="form-control"
              placeholder="Name of the website"
              value={sitename || ''}
              onChange={(e) => this.setState({ sitename: e.target.value })}
            />
            <input
              type="text"
              className="form-control"
              placeholder="email"
              value={mailContact || ''}
              onChange={(e) => this.setState({ mailContact: e.target.value })}
            />
            <label htmlFor="userJoin">
              Enable new user registration?
              <select
                className="form-control"
                name="user-join"
                defaultValue={joinAllowed}
                onChange={(e) => this.setState({ joinAllowed: (e.target.value === 'true') })}
              >
                <option value="undefined" disabled>Select an option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <button className="btn btn-primary pull-right" onClick={() => this.saveSettings()}>Save</button>
          </div>
        </Box>
      )
    }
    return null
  }
}

Settings.propTypes = {
  dispatch: React.PropTypes.func,
  settings: React.PropTypes.object,
}

export default connect((state) => ({
  settings: state.settings,
}))(Settings)
