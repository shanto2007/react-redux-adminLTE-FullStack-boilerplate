import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { startSavePost, clearPost } from 'actions/actions'

import Editor from 'shared/Editor'
import Box from 'shared/Box'

class PostCreate extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearPost())
  }

  onSave(e) {
    e.preventDefault()
    e.stopPropagation()
    const { dispatch } = this.props
    dispatch(startSavePost())
      .then((res) => {
        browserHistory.push(`/admin/post/${res.data.post._id}`)
      })
  }

  render() {
    const { loading, dispatch } = this.props
    return (
      <div id="admin-posts-create" className="container-fluid">
        <div className="col-sm-12 col-md-9">
          <Editor dispatch={dispatch} loading={loading} />
        </div>
        <div className="col-sm-12 col-md-3">
          <Box title="Post Controls">
            <button
              className="btn btn-block btn-primary"
              onClick={(e) => this.onSave(e)}
            >
              <i className="fa fa-save"></i> Save
            </button>
          </Box>
        </div>
        <div className="clearfix"></div>
      </div>
    )
  }
}

PostCreate.propTypes = {
  dispatch: React.PropTypes.func,
  post: React.PropTypes.object,
  loading: React.PropTypes.bool,
}


export default connect((state) => ({
  loading: state.posts.loading,
}))(PostCreate)
