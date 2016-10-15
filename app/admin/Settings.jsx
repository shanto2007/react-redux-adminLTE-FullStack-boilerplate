import React from 'react'
import { connect } from 'react-redux'
import { setSettings, startSaveSettings, startGetSettings } from 'actions'
import Box from 'Box'

class Settings extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(startGetSettings())
  }

  componentDidUpdate() {
    const { settings } = this.props.settings
    this.sitenameInput.value = settings.sitename
    this.mailContactInput.value = settings.mailContact
    this.joinAllowedInput.checked = settings.joinAllowed
  }

  saveSettings() {
    const { dispatch } = this.props;
    const sitename = this.sitenameInput.value
    const mailContact = this.mailContactInput.value
    const joinAllowed = this.joinAllowedInput.checked
    dispatch(setSettings({ sitename, mailContact, joinAllowed }))
    dispatch(startSaveSettings())
  }


  render() {
    return (
      <Box title="Settings" loading={this.props.settings.loading}>
        <div id="settings-box">
          <input
            ref={(c) => { this.sitenameInput = c }}
            type="text"
            placeholder="Name of the website"
          />
          <input
            ref={(c) => { this.mailContactInput = c }}
            type="text"
            placeholder="email"
          />
          <label htmlFor="userJoin">
            <input
              ref={(c) => { this.joinAllowedInput = c }}
              id="userjoin"
              type="checkbox"
            />
            Can New User join?
          </label>
          <button className="btn btn-primary pull-right" onClick={() => this.saveSettings()}>Save</button>
        </div>
      </Box>
    )
  }
}

Settings.propTypes = {
  dispatch: React.PropTypes.func,
  settings: React.PropTypes.object,
}

export default connect((state) => ({
  settings: state.settings,
}))(Settings)
