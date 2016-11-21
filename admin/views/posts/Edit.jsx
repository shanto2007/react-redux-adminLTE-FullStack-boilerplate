import React from 'react'
import { connect } from 'react-redux'
import {
  clearPost,
  startGetSinglePost,
  startEditPost,
  startDeletePostFeaturedImage,
} from 'actions/actions'

import Editor from 'shared/Editor'
import Box from 'shared/Box'
import PostFeaturedUploader from 'components/PostFeaturedUploader'

require('!style!css!sass!styles/components/post-single.scss')

class PostEdit extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { dispatch, params } = this.props
    dispatch(startGetSinglePost(params.id))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearPost())
  }

  onEdit(e) {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch } = this.props
    dispatch(startEditPost())
  }

  onDeletePostFeatured(e, post) {
    e.stopPropagation()
    e.preventDefault()
    const { dispatch } = this.props
    if (post && confirm('Do you want to remove the featured image?')) {
      dispatch(startDeletePostFeaturedImage(post._id))
    }
  }

  render() {
    const { loading, dispatch, post } = this.props
    if (post._id) {
      let FeaturedImage = <PostFeaturedUploader post={post} />
      if (post.media) {
        FeaturedImage = (
          <div className="post-image-wrapper">
            <i
              className="fa fa-remove pointer remove-button"
              onClick={(e) => this.onDeletePostFeatured(e, post)}
              data-toggle="tooltip"
              title="Remove Media"
            >
            </i>
            <img className="img-responsive" src={post.media.path} role="presentation" />
          </div>
        )
      }
      return (
        <div id="admin-posts-edit" className="container-fluid">
          <div className="col-sm-12 col-md-9">
            <Editor dispatch={dispatch} loading={loading} post={post} />
          </div>
          <div className="col-sm-12 col-md-3">
            <Box title="Post Controls">
              <button
                className="btn btn-block btn-warning"
                onClick={(e) => this.onEdit(e)}
              >
                <i className="fa fa-pencil"></i> Edit
              </button>
            </Box>
            <Box title="Featured Image">
              {FeaturedImage}
            </Box>
          </div>
          <div className="clearfix"></div>
        </div>
      )
    }
    return null
  }
}

PostEdit.propTypes = {
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  post: React.PropTypes.object,
  loading: React.PropTypes.bool,
}


export default connect((state) => ({
  loading: state.posts.loading,
  post: state.posts.post,
}))(PostEdit)
