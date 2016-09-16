import React from 'react'
import { connect } from 'react-redux'
import {
  setProjectImages,
  startEditingProject,
  getProjectData,
} from 'actions'

import Box from 'Box'

let mediaUploader;

function getDropzoneAssets() {
  const { Promise } = global
  return new Promise(resolve => {
    require.ensure([], () => {
      require('style!css!dropzone/dist/dropzone.css')

      resolve(require('dropzone'))
    }, 'dropzone-assets')
  })
}

class ProjectMediaUploader extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, projectId } = this.props;

    getDropzoneAssets().then((Dropzone) => {
      Dropzone.autoDiscover = false;
      mediaUploader = new Dropzone('#project-media-upload', {
        url: '/api/media/upload',
        paramName: 'media', // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        headers: { Authorization: this.props.authToken },
      });

      mediaUploader.on('sending', (file, xhr, formData) => {
        formData.append('projectId', projectId);
      });

      mediaUploader.on('success', (file, res) => {
        if (res.success) {
          const id = res.media._id;
          file.id = id;
          dispatch(setProjectImages(id));
          if (projectId) {
            dispatch(startEditingProject(projectId)).then(() => {
              dispatch(getProjectData(projectId));
            });
          }
        }
      });
    })
  }

  componentWillUnmount() {
    mediaUploader.destroy();
  }

  render() {
    const { loading } = this.props;
    return (
      <div>
        <Box title="Upload Project's Images" loading={loading}>
          <form className="dropzone" id="project-media-upload"></form>
        </Box>
      </div>
    );
  }
}

ProjectMediaUploader.propTypes = {
  projectId: React.PropTypes.string,
  authToken: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  loading: React.PropTypes.bool,
}

export default connect(state => ({
  authToken: state.account.authToken,
  loading: state.project.saving,
}))(ProjectMediaUploader)
