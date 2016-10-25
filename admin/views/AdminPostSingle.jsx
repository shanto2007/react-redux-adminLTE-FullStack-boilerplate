import React from 'react'
import { connect } from 'react-redux'
import { clearPost, startGetSinglePost, startEditPost } from 'actions'

import Editor from 'Editor'
import Box from 'Box'

class AdminPostSingle extends React.Component {
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

  render() {
    const { loading, dispatch, post } = this.props
    if (post._id) {
      return (
        <div id="admin-posts-create" className="container-fluid">
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
          </div>
          <div className="clearfix"></div>
        </div>
      )
    }
    return null
  }
}

AdminPostSingle.propTypes = {
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  post: React.PropTypes.object,
  loading: React.PropTypes.bool,
}


export default connect((state) => ({
  loading: state.posts.loading,
  post: state.posts.post,
}))(AdminPostSingle)
