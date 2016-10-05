export function MomentLoader() {
  return new Promise(resolve => {
    require.ensure([], () => {
      resolve({
        Moment: require('moment'),
      })
    }, 'moment-js')
  })
}
