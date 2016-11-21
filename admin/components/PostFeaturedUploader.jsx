import React from 'react'
import { connect } from 'react-redux'
import { DropzoneLoader } from 'utils/ChunkLoaders'
import {
  openToastr,
  startGetSinglePost,
} from 'actions/actions'

let mediaUploader

// teamPhoto
// teamAvatar

class PostFeaturedUploader extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, post } = this.props

    DropzoneLoader().then((modules) => {
      const { Dropzone } = modules
      Dropzone.autoDiscover = false
      mediaUploader = new Dropzone('#post-featured-uploader', {
        url: `/api/admin/post/${post._id}/featured`,
        paramName: 'postFeatured', // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        maxFiles: 1,
        headers: { Authorization: this.props.authToken },
      })

      mediaUploader.on('error', (file, message) => {
        dispatch(openToastr('error', message))
      })

      mediaUploader.on('sending', (file, xhr, formData) => {
        dispatch(openToastr('warning', 'Photo upload started!'))
        formData.append('postId', post._id)
      })

      mediaUploader.on('success', (file, res) => {
        if (res.success) {
          dispatch(openToastr('success', 'Photo uploaded!'))
          dispatch(startGetSinglePost(post._id))
        }
      })
    })
  }

  componentWillUnmount() {
    mediaUploader.destroy()
  }

  render() {
    return (
      <form className="dropzone" id="post-featured-uploader"></form>
    )
  }
}

PostFeaturedUploader.propTypes = {
  post: React.PropTypes.object,
  authToken: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  loading: React.PropTypes.bool,
}

export default connect(state => ({
  authToken: state.account.authToken,
}))(PostFeaturedUploader)
