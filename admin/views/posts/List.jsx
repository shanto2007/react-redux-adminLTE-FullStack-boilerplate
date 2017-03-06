import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import Box from 'shared/Box'
import { MomentLoader } from 'utils/ChunkLoaders'
import { startGetPosts, clearPosts, startDeletePost } from 'actions/actions'

class PostList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Moment: undefined,
    }
  }

  componentWillMount() {
    MomentLoader().then((module) => {
      this.setState({
        Moment: module.Moment,
      })
    })
    const { dispatch } = this.props
    dispatch(startGetPosts())
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearPosts())
  }

  onPostRemove(e, post) {
    e.stopPropagation()
    const { dispatch } = this.props
    if (post && post._id && confirm('Do you want to delete this post?')) {
      dispatch(startDeletePost(post._id))
    }
  }

  renderPostList() {
    const { posts } = this.props.posts
    const { Moment } = this.state
    Moment.locale('it')
    if (posts) {
      return posts.map((post, i) => {
        return (
          <tr key={post._id}>
            <td>
              <Link to={`/admin/post/${post._id}`}><i className="fa fa-pencil fa-2x pointer"></i></Link>
            </td>
            <td>{post.title}</td>
            <td>{post.type}</td>
            <td>{Moment(post.date).format('lll')}</td>
            <th>
              <i className="fa fa-remove pointer fa-2x" onClick={e => this.onPostRemove(e, post)}></i>
            </th>
          </tr>
        )
      })
    }
    return null
  }

  render() {
    const { loading } = this.props
    const { Moment } = this.state
    if (Moment) {
      return (
        <div id="admin-posts-list" className="container-fluid">
          <Box loading={loading} title="Posts List">
            <table className="table">
              <tbody>
                <tr>
                  <th> <i className="fa fa-cog"></i> </th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th></th>
                </tr>
                {this.renderPostList()}
              </tbody>
            </table>
          </Box>
        </div>
      )
    }
    return null
  }
}

PostList.propTypes = {
  dispatch: React.PropTypes.func,
  posts: React.PropTypes.object,
  loading: React.PropTypes.bool,
}


export default connect(state => ({
  posts: state.posts,
}))(PostList)
