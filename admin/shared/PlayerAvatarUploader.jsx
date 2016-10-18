import React from 'react'
import { connect } from 'react-redux'
import { DropzoneLoader } from 'ChunkLoaders'
import {
  openToastr,
  startGetAdminSingleTeam,
} from 'actions'

let mediaUploader

class PlayerAvatarUploader extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, player } = this.props

    DropzoneLoader().then((modules) => {
      const { Dropzone } = modules
      Dropzone.autoDiscover = false
      const uniqueId = player._id.slice(this.length - 6)
      mediaUploader = new Dropzone(`#player-avatar-uploader${uniqueId}`, {
        url: `/api/admin/player/${player._id}/avatar`,
        paramName: 'playerAvatar', // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        headers: { Authorization: this.props.authToken },
      })

      mediaUploader.on('sending', (file, xhr, formData) => {
        dispatch(openToastr('warning', 'Photo upload started!'))
        formData.append('playerId', player._id)
      })

      mediaUploader.on('success', (file, res) => {
        if (res.success) {
          dispatch(openToastr('success', 'Photo uploaded!'))
          dispatch(startGetAdminSingleTeam(player.team))
        }
      })
    })
  }

  componentWillUnmount() {
    mediaUploader.destroy()
  }

  render() {
    const { player } = this.props
    const uniqueId = player._id.slice(this.length - 6)
    return (
      <form className="dropzone hide" id={`player-avatar-uploader${uniqueId}`}></form>
    )
  }
}

PlayerAvatarUploader.propTypes = {
  player: React.PropTypes.object,
  authToken: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  loading: React.PropTypes.bool,
}

export default connect(state => ({
  authToken: state.account.authToken,
}))(PlayerAvatarUploader)
