import React from 'react'
import { connect } from 'react-redux'
import { loadMedium } from 'ChunkLoader'
import { setProjectTitle, setProjectDescription, setProjectData } from 'actions'
import Box from 'Box'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Medium: null,
    }
  }

  componentWillMount() {
    loadMedium().then((Medium) => {
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
        Medium.on(
          document.getElementById('editor'),
          'input',
          this.getDescription.bind(this)
        )
      }
    })
  }

  componentDidUpdate() {
    const { project } = this.props.project
    const { projectId } = this.props
    const { Medium } = this.state
    if (Medium && projectId && !Medium.getContent().length) {
      Medium.setContent(project.description)
      this.titleInput.value = project.title
    }
  }

  componentWillUnmount() {
    const { Medium } = this.state
    this.props.dispatch(setProjectData())
    Medium.off(document.getElementById('editor'), 'input', this.getDescription.bind(this))
    Medium.destroy()
  }

  getTitle() {
    const { dispatch } = this.props
    const title = this.titleInput.value
    dispatch(setProjectTitle(title))
  }

  getDescription() {
    const { dispatch } = this.props
    const { Medium } = this.state
    const description = Medium.getContent()
    //  TODO validation
    dispatch(setProjectDescription(description))
  }

  render() {
    const { loading } = this.props
    return (
      <Box title="Project Content" loading={loading}>
        <div id="project-editor">
          <input
            id="project-title"
            className="form-control"
            ref={(c) => { this.titleInput = c }}
            type="text"
            placeholder="Project Title"
            style={{ boxShadow: 'none' }}
            onKeyUp={() => this.getTitle()}
          />
          <div id="editor"></div>
        </div>
      </Box>
    )
  }

}

Editor.propTypes = {
  projectId: React.PropTypes.string,
  project: React.PropTypes.object,
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool,
}

export default connect((state) => ({
  project: state.project,
  loading: state.project.saving,
}))(Editor)
