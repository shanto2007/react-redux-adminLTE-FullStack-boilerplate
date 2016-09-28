import React from 'react'
import TeamPhotoUploader from 'TeamPhotoUploader'
import TeamAvatarUploader from 'TeamAvatarUploader'
import { startEditAdminSingleTeamName } from 'actions'

const blackBase64Gif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

require('!style!css!sass!app/styles/admin/team-info.scss')

class TeamInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editTeamName: false,
      newTeamName: undefined,
    }
  }

  onPhotoClick(e) {
    e.stopPropagation()
    const photoUploader = document.getElementById('team-media-photo')
    photoUploader.click()
  }

  onAvatarClick(e) {
    e.stopPropagation()
    const AvatarUploader = document.getElementById('team-media-avatar')
    AvatarUploader.click()
  }

  onTeamNameEdit(e) {
    e.preventDefault()
    e.stopPropagation()
    const newName = e.target.value
    if (newName) {
      this.setState({
        newTeamName: newName,
      })
    }
  }

  teamEditSave() {
    const name = this.state.newTeamName
    const { dispatch, team } = this.props
    if (team._id && name) {
      return dispatch(startEditAdminSingleTeamName(team._id, name)).then(() => {
        this.setState({
          editTeamName: false,
          newTeamName: undefined,
        })
      })
    }
    return new Error('missing id or new name')
  }

  showTeamNameOrEditArea() {
    const { editTeamName } = this.state
    const { team } = this.props
    if (!editTeamName) { // I KNOW I'M DEBUGGING MORON
      return (
        <h3 className="widget-user-username">
          <i className="fa fa-pencil" onClick={() => this.setState({ editTeamName: true })}></i>
          &nbsp; {team.name}
        </h3>
      )
    }
    let saveIcon = <i className="fa fa-save pointer save-icon" onClick={() => this.teamEditSave()}></i>
    if (!this.state.newTeamName || !this.state.newTeamName.length) saveIcon = null
    return (
      <div className="team-name-editor">
        { saveIcon }
        <input
          type="text"
          className="form-control edit-team-name"
          placeholder="Insert team name"
          defaultValue={team.name} onChange={(e) => this.onTeamNameEdit(e)}
        />
      </div>
    )
  }

  render() {
    const {
      team,
    } = this.props
    if (team) {
      return (
        <div className="box box-widget widget-user box-widget-team-single">
          <div
            className="widget-user-header team-header bg-primary"
            style={team.groupPhoto ? { background: `url(${team.groupPhoto.path}) center center` } : {}}
          >
            <i className="fa fa-camera groupPhoto-upload-icon" onClick={(e) => this.onPhotoClick(e)}></i>

            {this.showTeamNameOrEditArea()}

            <h5 className="widget-user-desc">Season: {team.season.year}</h5>
            <h5 className="widget-user-desc">Round: {team.round.label}</h5>
          </div>
          <div className="widget-user-image team-avatar">
            <img className="img-circle" src={team.avatar ? team.avatar.thumbnail : blackBase64Gif} alt="Team Avatar" />
            <i className="fa fa-camera avatar-upload-icon" onClick={(e) => this.onAvatarClick(e)}></i>
          </div>
          <div className="box-footer">
            <div className="row">
              <div className="col-sm-4 border-right">
                <div className="description-block">
                  <h5 className="description-header">{team.wins}</h5>
                  <span className="description-text">WINS</span>
                </div>
              </div>
              <div className="col-sm-4 border-right">
                <div className="description-block">
                  <h5 className="description-header">{team.draws}</h5>
                  <span className="description-text">DRAWS</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="description-block">
                  <h5 className="description-header">{team.losts}</h5>
                  <span className="description-text">LOSES</span>
                </div>
              </div>
            </div>
          </div>
          <TeamPhotoUploader team={team} />
          <TeamAvatarUploader team={team} />
        </div>
      )
    }
    return null
  }
}

TeamInfo.propTypes = {
  dispatch: React.PropTypes.func,
  team: React.PropTypes.object,
}

export default TeamInfo
