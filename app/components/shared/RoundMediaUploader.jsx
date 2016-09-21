import React from 'react'
import { openToastr, startGetAdminRounds } from 'actions'
import { connect } from 'react-redux'

let mediaUploader

function getDropzoneAssets() {
  const { Promise } = global
  return new Promise(resolve => {
    require.ensure([], () => {
      require('style!css!dropzone/dist/dropzone.css')

      resolve(require('dropzone'))
    }, 'dropzone-assets')
  })
}

class RoundMediaUploader extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, round } = this.props

    getDropzoneAssets().then((Dropzone) => {
      Dropzone.autoDiscover = false
      mediaUploader = new Dropzone(`#round-media-upload-${round._id}`, {
        url: `/api/admin/round/${round._id}/photo`,
        paramName: 'roundHostPhoto', // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        headers: { Authorization: this.props.authToken },
      })

      mediaUploader.on('sending', (file, xhr, formData) => {
        formData.append('roundId', round._id)
      })

      mediaUploader.on('success', (file, res) => {
        if (res.success) {
          dispatch(openToastr('success', 'Photo uploaded!'))
          dispatch(startGetAdminRounds(round.season._id))
        }
      })
    })
  }

  componentWillUnmount() {
    mediaUploader.destroy()
  }

  render() {
    const { round } = this.props
    return (
      <form className="dropzone" id={`round-media-upload-${round._id}`}></form>
    )
  }
}

RoundMediaUploader.propTypes = {
  round: React.PropTypes.object,
  authToken: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  loading: React.PropTypes.bool,
}

export default connect(state => ({
  authToken: state.account.authToken,
}))(RoundMediaUploader)
