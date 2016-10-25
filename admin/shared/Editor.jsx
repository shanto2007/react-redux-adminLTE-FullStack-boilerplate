import React from 'react'
import { MediumLoader } from 'ChunkLoaders'
import {
  setSinglePostTitle,
  setSinglePostBody,
} from 'actions'
import Box from 'Box'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Medium: null,
      title: null,
      body: null,
    }
  }

  componentWillMount() {
    MediumLoader().then((Medium) => {
      this.setState({
        Medium: new Medium('#editor', {
          autoLink: true,
          targetBlank: true,
        }),
      })
    }).then(() => {
      const { Medium } = this.state
      /**
       * Input Listener
       */
      if (Medium) {
        Medium.subscribe('editableInput', this.getDescription.bind(this))
      }
    })
  }

  componentDidUpdate() {
    const { post } = this.props
    const { Medium } = this.state
    if (Medium && post && !Medium.getContent().length) {
      Medium.setContent(post.body)
      this.titleInput.value = post.title
    }
  }

  componentWillUnmount() {
    const { Medium } = this.state
    Medium.unsubscribe('editableInput', this.getDescription.bind(this))
    Medium.destroy()
  }

  getTitle() {
    const { dispatch } = this.props
    const title = this.titleInput.value
    dispatch(setSinglePostTitle(title))
  }

  getDescription() {
    const { dispatch } = this.props
    const { Medium } = this.state
    const body = Medium.getContent()
    dispatch(setSinglePostBody(body))
  }

  render() {
    const { loading } = this.props
    return (
      <Box title="Post Content" loading={loading}>
        <div id="post-editor">
          <input
            id="post-title"
            className="form-control"
            ref={(c) => { this.titleInput = c }}
            type="text"
            placeholder="Project Title"
            style={{ boxShadow: 'none' }}
            onChange={() => this.getTitle()}
          />
          <div id="editor"></div>
        </div>
      </Box>
    )
  }

}

Editor.propTypes = {
  dispatch: React.PropTypes.func,
  post: React.PropTypes.object,
  loading: React.PropTypes.bool,
}

export default Editor
