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
