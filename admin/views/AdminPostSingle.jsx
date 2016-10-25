import React from 'react'
import { connect } from 'react-redux'
import Box from 'Box'
// import { startGetSinglePost, clearPost } from 'actions'

class AdminPostSingle extends React.Component {
  constructor(props) {
    super(props)
  }

  // componentWillUnmount() {
  //   const { dispatch } = this.props
  //   dispatch(clearPost())
  // }

  render() {
    return (
      <div id="admin-posts-single" className="container-fluid">
        <Box title="Create EDIT SINGLE I HAVE TO SEE">

        </Box>
      </div>
    )
  }
}

AdminPostSingle.propTypes = {
  dispatch: React.PropTypes.func,
  post: React.PropTypes.object,
}


export default connect((state) => ({
  posts: state.posts.post,
}))(AdminPostSingle)
