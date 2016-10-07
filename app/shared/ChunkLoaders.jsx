export function MomentLoader() {
  const { Promise } = global
  return new Promise(resolve => {
    require.ensure([], () => {
      resolve({
        Moment: require('moment'),
      })
    }, 'moment-js')
  })
}

export function DropzoneLoader() {
  const { Promise } = global
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
  const { Promise } = global
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
