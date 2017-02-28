const { Promise } = global

/**
 * MOMENTJS CHUNK
 */
export function MomentLoader() {
  return new Promise(resolve => {
    require.ensure([], () => {
      resolve({
        Moment: require('moment'),
      })
    }, 'moment-js')
  })
}

/**
 * DROPZONE CHUNK
 */
export function DropzoneLoader() {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('dropzone/dist/dropzone.css')

      resolve({
        Dropzone: require('dropzone'),
      })
    }, 'dropzone-js')
  })
}

/**
 * ADMIN ASSETS
 * AdminLTE
 * Bootstrap
 * font-awesome
 */
export function getAdminStaticAssets() {
  return new Promise(resolve => {
    require.ensure([], () => {
      /**
       * AdminLTE Options
       */
      global.AdminLTEOptions = {
        enableBSToppltip: true,
      }
      require('admin-lte/bootstrap/css/bootstrap.css')
      require('admin-lte/dist/css/AdminLTE.css')
      require('admin-lte/dist/css/skins/skin-blue.css')
      require('font-awesome/css/font-awesome.css')
      require('!script-loader!admin-lte/bootstrap/js/bootstrap.js')
      require('!script-loader!admin-lte/dist/js/app.min.js')

      resolve({ loaded: true })
    }, 'admin-static-assets')
  })
}

/**
 * MEDIUM CHUNK
 */
export const MediumLoader = function MediumLoader() {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('medium-editor/dist/css/medium-editor.css')
      require('medium-editor/dist/css/themes/default.css')
      resolve(require('medium-editor/dist/js/medium-editor.min.js'))
    }, 'medium-editor')
  })
}
