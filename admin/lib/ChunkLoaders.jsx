const { Promise } = global

//  Chunking assets
export const loadAdminStaticAssets = function loadAdminStaticAssets() {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('!style!css!admin-lte/bootstrap/css/bootstrap.min.css')
      require('!style!css!admin-lte/dist/css/AdminLTE.min.css')
      require('!style!css!admin-lte/dist/css/skins/skin-blue.min.css')
      require('!style!css!font-awesome/css/font-awesome.min.css')
      require('!script!admin-lte/bootstrap/js/bootstrap.min.js')
      require('!script!admin-lte/dist/js/app.min.js')

      resolve()
    }, 'admin-static-assets')
  })
}

export const loadMedium = function loadMedium() {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('style!css!medium-editor/dist/css/medium-editor.css')
      require('style!css!medium-editor/dist/css/themes/default.css')
      resolve(require('medium-editor/dist/js/medium-editor.min.js'))
    }, 'medium-editor')
  })
}

export const loadDropzone = function loadDropzone() {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('style!css!dropzone/dist/dropzone.css')

      resolve(require('dropzone'))
    }, 'dropzone-assets')
  })
}
