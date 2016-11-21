import Api from 'utils/Http'
import { openToastr } from './toastr.action'

/**
 * ACCOUNT ACTIONS
 */
export const accountLoading = (loading = false) => ({
  type: 'ACCOUNT_LOADING',
  loading,
})

export const accountSuccess = (success = false) => ({
  type: 'ACCOUNT_SUCCESS',
  success,
})

export const accountFail = (fail = false) => ({
  type: 'ACCOUNT_FAIL',
  fail,
})

export const setAuthToken = (authToken = '') => ({
  type: 'ACCOUNT_SET_AUTH_TOKEN',
  authToken,
})

export const accountSetData = (user = {}) => ({
  type: 'ACCOUNT_SET_USER_DATA',
  user,
})

export const accountCheckPassword = (check = false) => ({
  type: 'ACCOUNT_CHECK_PASSWORD',
  check,
})

export const accountCheckEmailExist = (check = true) => ({
  type: 'ACCOUNT_CHECK_EMAIL_EXIST',
  check,
})

export const getUserData = () => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(accountLoading(true))
    return Api.get('/me', {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(accountLoading(false))
      dispatch(accountSuccess(true))
      dispatch(accountSetData(res.data.user))
      return res
    })
    .catch((err) => {
      // dispatch(accountLoading(false))
      dispatch(accountFail(true))
      dispatch(setAuthToken(''))
      return err.response
    })
  }
}

export const accountStartCheckEmailExist = (email) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(accountLoading(true))
    return Api.get(`/user/email/${email}/exist`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(accountFail(false))
      dispatch(accountLoading(false))
      dispatch(accountSuccess(true))
      dispatch(accountCheckEmailExist(res.data.exist))
      return res
    })
    .catch((err) => {
      dispatch(accountFail(true))
      dispatch(accountLoading(false))
      dispatch(accountSuccess(false))
      dispatch(accountCheckEmailExist(err.response.data.exist))
      return err.response
    })
  }
}

export const accountStartCheckPassword = (userId, password) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(accountLoading(true))
    return Api.post(`/user/${userId}/check-password`, { password }, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(accountFail(false))
      dispatch(accountLoading(false))
      dispatch(accountSuccess(true))
      dispatch(accountCheckPassword(res.data.success))
      return res
    })
    .catch((err) => {
      console.log(err.response)
      dispatch(accountFail(true))
      dispatch(accountLoading(false))
      dispatch(accountSuccess(false))
      dispatch(accountCheckPassword(false))
      return err.response
    })
  }
}

export const accountStartChangePassword = (userId, password, newPassword) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(accountLoading(true))
    return Api.post(`/user/${userId}/change-password`, { password, newPassword }, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(accountFail(false))
      dispatch(accountLoading(false))
      dispatch(accountSuccess(true))
      dispatch(accountSetData(res.data.user))
      dispatch(setAuthToken(res.data.token))
      dispatch(accountCheckPassword(null))
      dispatch(openToastr('success', 'Password Changed!'))
      return res
    })
    .catch((err) => {
      dispatch(accountFail(true))
      dispatch(accountLoading(false))
      dispatch(accountSuccess(false))
      dispatch(accountCheckPassword(null))
      dispatch(openToastr('error', 'Error changing password!'))
      return err.response
    })
  }
}

export const accountStartChangeEmail = (userId, email) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(accountLoading(true))
    return Api.post(`/user/${userId}/change-email`, { email }, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(accountFail(false))
      dispatch(accountLoading(false))
      dispatch(accountSuccess(true))
      dispatch(accountSetData(res.data.user))
      dispatch(accountCheckEmailExist(null))
      dispatch(openToastr('success', 'Email Changed!'))
      return res
    })
    .catch((err) => {
      dispatch(accountFail(true))
      dispatch(accountLoading(false))
      dispatch(accountSuccess(false))
      dispatch(accountCheckEmailExist(null))
      dispatch(openToastr('error', 'Error changing email!'))
      return err.response
    })
  }
}
