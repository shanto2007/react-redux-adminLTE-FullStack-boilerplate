import React from 'react'
import { connect } from 'react-redux'
import Box from 'Box'
import { startGetPosts, clearPosts } from 'actions'

class AdminPostsList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(startGetPosts())
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearPosts())
  }

  render() {
    const { posts, loading } = this.props.posts
    return (
      <div id="admin-posts-list" className="container-fluid">
        <Box loading={loading}>
          <pre>
            {posts}
          </pre>
        </Box>
      </div>
    )
  }
}

AdminPostsList.propTypes = {
  dispatch: React.PropTypes.func,
  posts: React.PropTypes.object,
}


export default connect((state) => ({
  posts: state.posts,
}))(AdminPostsList)
