import React from 'react'
import { connect } from 'react-redux'
import {
  openToastr,
  startGetAdminSingleTeam,
} from 'actions'

let mediaUploader

// teamPhoto
// teamAvatar

function getDropzoneAssets() {
  const { Promise } = global
  return new Promise(resolve => {
    require.ensure([], () => {
      require('style!css!dropzone/dist/dropzone.css')

      resolve(require('dropzone'))
    }, 'dropzone-assets')
  })
}

class TeamAvatarUploader extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, team } = this.props

    getDropzoneAssets().then((Dropzone) => {
      Dropzone.autoDiscover = false
      mediaUploader = new Dropzone('#team-media-avatar', {
        url: `/api/admin/team/${team._id}/avatar`,
        paramName: 'teamAvatar', // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        headers: { Authorization: this.props.authToken },
      })

      mediaUploader.on('sending', (file, xhr, formData) => {
        formData.append('teamId', team._id)
      })

      mediaUploader.on('success', (file, res) => {
        if (res.success) {
          dispatch(openToastr('success', 'Photo uploaded!'))
          dispatch(startGetAdminSingleTeam(team._id))
        }
      })
    })
  }

  componentWillUnmount() {
    mediaUploader.destroy()
  }

  render() {
    return (
      <form className="dropzone hide" id="team-media-avatar"></form>
    )
  }
}

TeamAvatarUploader.propTypes = {
  team: React.PropTypes.object,
  authToken: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  loading: React.PropTypes.bool,
}

export default connect(state => ({
  authToken: state.account.authToken,
}))(TeamAvatarUploader)
