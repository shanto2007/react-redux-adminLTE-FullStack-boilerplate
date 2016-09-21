import React from 'react'
import TeamPhotoUploader from 'TeamPhotoUploader'
import TeamAvatarUploader from 'TeamAvatarUploader'

class TeamSingle extends React.Component {
  constructor(props) {
    super(props)
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

  render() {
    const {
      team,
    } = this.props
    return (
      <div className="box box-widget widget-user">
        <div
          className="widget-user-header bg-black"
          style={{ background: `url(${team.groupPhoto.path}) center center` }}
          onClick={(e) => this.onPhotoClick(e)}
        >
          <h3 className="widget-user-username">{team.name}</h3>
          <h5 className="widget-user-desc">Season: {team.season.year}</h5>
          <h5 className="widget-user-desc">Round: {team.round.label}</h5>
        </div>
        <div className="widget-user-image">
          <img className="img-circle" src={team.avatar.thumbnail} alt="Team Avatar" onClick={(e) => this.onAvatarClick(e)} />
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
                <span className="description-text">LOSS</span>
              </div>
            </div>
          </div>
        </div>
        <TeamPhotoUploader team={team} />
        <TeamAvatarUploader team={team} />
      </div>
    )
  }
}

TeamSingle.propTypes = {
  team: React.PropTypes.object,
}

export default TeamSingle
