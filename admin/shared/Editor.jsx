import React from 'react'
import { MediumLoader } from 'ChunkLoaders'
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

  // componentDidUpdate() {
  //   const { post } = this.props.post
  //   const { postId } = this.props
  //   const { Medium } = this.state
  //   if (Medium && postId && !Medium.getContent().length) {
  //     Medium.setContent(post.description)
  //     this.titleInput.value = post.title
  //   }
  // }

  componentWillUnmount() {
    const { Medium } = this.state
    Medium.unsubscribe('editableInput', this.getDescription.bind(this))
    Medium.destroy()
  }

  getTitle() {
    const title = this.titleInput.value
    this.setState({ title })
  }

  getDescription() {
    const { Medium } = this.state
    const body = Medium.getContent()
    this.setState({ body })
  }

  getData(callback) {
    return callback({
      title: this.state.title,
      body: this.state.body,
    })
  }

  render() {
    const { loading, getDataHandler } = this.props
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
            onKeyUp={() => this.getTitle()}
          />
          <div id="editor"></div>
          <button
            className="btn btn-block btn-primary"
            onClick={() => this.getData(getDataHandler)}
          >
            Save
          </button>
        </div>
      </Box>
    )
  }

}

Editor.propTypes = {
  getDataHandler: React.PropTypes.func.isRequired,
  post: React.PropTypes.object,
  loading: React.PropTypes.bool,
}

export default Editor
