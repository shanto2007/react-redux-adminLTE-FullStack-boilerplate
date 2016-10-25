import React from 'react'
import { connect } from 'react-redux'
import Editor from 'Editor'
import { startSavePost, clearPost } from 'actions'

class AdminPostCreate extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearPost())
  }

  getDataHandler(data) {
    const { dispatch } = this.props
    dispatch(startSavePost(data))
    .then((res) => {
      console.log('>>>', res)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render() {
    const { loading, post } = this.props
    return (
      <div id="admin-posts-create" className="container-fluid">
        <Editor getDataHandler={(data) => this.getDataHandler(data)} loading={loading} post={post.title ? post : null} />
      </div>
    )
  }
}

AdminPostCreate.propTypes = {
  dispatch: React.PropTypes.func,
  post: React.PropTypes.object,
  loading: React.PropTypes.bool,
}


export default connect((state) => ({
  post: state.posts.post,
  loading: state.posts.loading,
}))(AdminPostCreate)
