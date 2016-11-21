import Api from 'lib/Http'

export const mailLoading = (loading = false) => ({
  type: 'MAIL_LOADING',
  loading,
})

export const mailSuccess = (success) => ({
  type: 'MAIL_SUCCESS',
  success,
})

export const mailFail = (fail) => ({
  type: 'MAIL_FAIL',
  fail,
})

export const setMail = (mail = {}) => ({
  type: 'SET_MAIL',
  mail,
})

export const startSendMail = (config) => {
  return (dispatch) => {
    dispatch(mailLoading(true))
    return Api.post('/email', {
      from: `${config.name} <${config.email}>`,
      subject: config.subject,
      message: config.message,
    })
    .then((res) => {
      dispatch(mailLoading(false))
      dispatch(mailSuccess(true))
      return res;
    })
    .catch((err) => {
      console.error(err)
      dispatch(mailLoading(false))
      dispatch(mailFail(true))
      return err;
    })
  }
}
