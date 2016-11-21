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
      require('style!css!dropzone/dist/dropzone.css')

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
      require('!style!css!admin-lte/bootstrap/css/bootstrap.min.css')
      require('!style!css!admin-lte/dist/css/AdminLTE.min.css')
      require('!style!css!admin-lte/dist/css/skins/skin-blue.min.css')
      require('!style!css!font-awesome/css/font-awesome.min.css')
      require('!script!admin-lte/bootstrap/js/bootstrap.min.js')
      require('!script!admin-lte/dist/js/app.min.js')

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
      require('style!css!medium-editor/dist/css/medium-editor.css')
      require('style!css!medium-editor/dist/css/themes/default.css')
      resolve(require('medium-editor/dist/js/medium-editor.min.js'))
    }, 'medium-editor')
  })
}
