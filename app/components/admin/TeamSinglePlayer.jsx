import React from 'react'
import PlayerAvatarUploader from 'PlayerAvatarUploader'
import { startDeletePlayer } from 'actions'

const blackBase64Gif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

class TeamSinglePlayer extends React.Component {
  constructor(props) {
    super(props)
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

  render() {
    const { player } = this.props
    if (player) {
      return (
        <div className="box box-widget widget-user box-widget-player-single">
          <i className="fa fa-remove player-remove-button" onClick={(e) => this.onPlayerRemove(e, player)}></i>
          <PlayerAvatarUploader player={player} />
          <div className="widget-user-header bg-aqua-active">
            <h3 className="widget-user-username">{player.fullname}</h3>
          </div>
          <div className="widget-user-image">
            <img className="img-circle" src={player.avatar ? player.avatar.thumbnail : blackBase64Gif} alt="Player Avatar" />
            <i className="fa fa-camera avatar-upload-icon" onClick={(e) => this.onAvatarClick(e)}></i>
          </div>
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
