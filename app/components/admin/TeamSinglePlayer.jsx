import React from 'react'
import PlayerAvatarUploader from 'PlayerAvatarUploader'
import { startDeletePlayer, startEditPlayer } from 'actions'

const blackBase64Gif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

class TeamSinglePlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editingPlayerInfo: false,
      playerName: undefined,
      playerSurname: undefined,
    }
  }

  onAvatarClick(e) {
    e.stopPropagation()
    const { player } = this.props
    const uniqueId = player._id.slice(this.length - 6)
    const AvatarUploader = document.getElementById(`player-avatar-uploader${uniqueId}`)
    AvatarUploader.click()
  }

  onPlayerRemove(e, player) {
    e.stopPropagation()
    e.preventDefault()
    const { dispatch } = this.props
    if (player && confirm(`Do you want to remove player: ${player.fullname}`)) {
      dispatch(startDeletePlayer(player._id))
    }
  }

  onPlayerNameEdit(e) {
    e.preventDefault()
    e.stopPropagation()
    const newName = e.target.value
    if (newName) {
      this.setState({
        playerName: newName,
      })
    }
  }
  onPlayerSurnameEdit(e) {
    e.preventDefault()
    e.stopPropagation()
    const newSurname = e.target.value
    if (newSurname) {
      this.setState({
        playerSurname: newSurname,
      })
    }
  }

  playerEditNameSave() {
    const { playerName } = this.state
    const { dispatch, player } = this.props
    if (player._id && playerName) {
      return dispatch(startEditPlayer(player._id, { name: playerName })).then(() => {
        this.setState({
          editingPlayerInfo: false,
          playerName: undefined,
          playerSurname: undefined,
        })
      })
    }
    return new Error('missing id or new name')
  }

  playerEditSurnameSave() {
    const { playerSurname } = this.state
    const { dispatch, player } = this.props
    if (player._id && playerSurname) {
      return dispatch(startEditPlayer(player._id, { surname: playerSurname })).then(() => {
        this.setState({
          editingPlayerInfo: false,
          playerName: undefined,
          playerSurname: undefined,
        })
      })
    }
    return new Error('missing id or new name')
  }

  showPlayerNameOrEditArea() {
    const { editingPlayerInfo } = this.state
    const { player } = this.props
    if (!editingPlayerInfo) {
      return (
        <h3 className="widget-user-username">
          <i className="fa fa-pencil" onClick={() => this.setState({ editingPlayerInfo: true })}></i>
          &nbsp; {player.fullname}
        </h3>
      )
    }
    let nameSaveIcon = <i className="fa fa-save pointer save-icon" onClick={() => this.playerEditNameSave()}></i>
    let surnameSaveIcon = <i className="fa fa-save pointer save-icon" onClick={() => this.playerEditSurnameSave()}></i>
    if (!this.state.playerName || !this.state.playerName.length) nameSaveIcon = null
    if (!this.state.playerSurname || !this.state.playerSurname.length) surnameSaveIcon = null
    return (
      <div>
        <div className="player-name-editor">
          { nameSaveIcon }
          <input
            type="text"
            className="form-control edit-player-name"
            placeholder="Insert name"
            defaultValue={player.name} onChange={(e) => this.onPlayerNameEdit(e)}
          />
        </div>
        <div className="player-surname-editor">
          { surnameSaveIcon }
          <input
            type="text"
            className="form-control edit-player-surname"
            placeholder="Insert surname"
            defaultValue={player.surname} onChange={(e) => this.onPlayerSurnameEdit(e)}
          />
        </div>
      </div>
    )
  }

  avatarSwitch() {
    const { editingPlayerInfo } = this.state
    const { player } = this.props
    if (!editingPlayerInfo) {
      return (
        <div className="widget-user-image">
          <img className="img-circle" src={player.avatar ? player.avatar.thumbnail : blackBase64Gif} alt="Player Avatar" />
          <i className="fa fa-camera avatar-upload-icon" onClick={(e) => this.onAvatarClick(e)}></i>
        </div>
      )
    }
    return null
  }

  removeBackButtonSwitcher() {
    const { editingPlayerInfo } = this.state
    const { player } = this.props
    const defaultState = {
      editingPlayerInfo: false,
      playerName: undefined,
      playerSurname: undefined,
    }
    if (editingPlayerInfo) {
      return <i className="fa fa-arrow-left player-back-button" onClick={() => this.setState(defaultState)}></i>
    }
    return <i className="fa fa-remove player-remove-button" onClick={(e) => this.onPlayerRemove(e, player)}></i>
  }

  render() {
    const { player } = this.props
    if (player) {
      return (
        <div className="box box-widget widget-user box-widget-player-single">
          {this.removeBackButtonSwitcher()}
          <PlayerAvatarUploader player={player} />
          <div className="widget-user-header bg-aqua-active">
            {this.showPlayerNameOrEditArea()}
          </div>
          { this.avatarSwitch() }
          <div className="box-footer">
            <div className="row">
              <div className="col-sm-3 border-right">
                <div className="description-block">
                  <h5 className="description-header">{player.attendance}</h5>
                  <span className="description-text"> <i className="fa fa-check"></i> </span>
                </div>
              </div>
              <div className="col-sm-3 border-right">
                <div className="description-block">
                  <h5 className="description-header">{player.goals}</h5>
                  <span className="description-text"> <i className="fa fa-futbol-o"></i> </span>
                </div>
              </div>
              <div className="col-sm-3 border-right">
                <div className="description-block">
                  <h5 className="description-header">{player.warns}</h5>
                  <span className="description-text"> <i className="fa fa-square" style={{ color: 'orange' }}></i> </span>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="description-block">
                  <h5 className="description-header">{player.expulsions}</h5>
                  <span className="description-text"> <i className="fa fa-square" style={{ color: 'red' }}></i> </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }
}

TeamSinglePlayer.propTypes = {
  dispatch: React.PropTypes.func,
  player: React.PropTypes.object,
}

export default TeamSinglePlayer
