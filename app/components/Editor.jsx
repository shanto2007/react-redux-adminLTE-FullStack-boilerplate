import React from 'react'
import { connect } from 'react-redux'
import { setProjectTitle, setProjectDescription, setProjectData } from 'actions'
import Box from 'Box'

require('style!css!medium-editor/dist/css/medium-editor.css')
require('style!css!medium-editor/dist/css/themes/default.css')

const { Promise } = global

//  Chunk Medium
function getMediumeditor() {
  return new Promise(resolve => {
    require.ensure([], () => {
      resolve(require('medium-editor/dist/js/medium-editor.min.js'))
    }, 'medium-editor')
  })
}

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Medium: null,
    }
  }

  componentDidMount() {
    getMediumeditor().then((Medium) => {
      this.setState({
        Medium: new Medium('#editor'),
      })
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
            ref={(c) => { this.titleInput = c }}
            type="text"
            placeholder="Project Title"
            style={{ boxShadow: 'none' }}
            onKeyUp={() => this.getTitle()}
          />
          <div id="editor" onKeyUp={() => this.getDescription()}></div>
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
