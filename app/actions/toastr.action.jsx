/**
 * TOASTR NOTIFICATIONS
 */

export const openToastr = (toastrType = null, title = '', message = '') => ({
  type: 'TOASTR_OPEN',
  toastrType,
  title,
  message,
})

export const closeToastr = () => ({
  type: 'TOASTR_CLOSE',
})
