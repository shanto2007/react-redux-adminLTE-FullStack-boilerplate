import Api from 'Http'
import { accountSetData, setAuthToken } from './account.action'

/**
 * AUTH ACTIONS
 */
export const authLoading = (loading = false) => ({
  type: 'AUTH_LOADING',
  loading,
})

export const loginFormError = (formError = '') => ({
  type: 'AUTH_LOGIN_FORM_ERROR',
  formError,
})

export const logout = () => ({
  type: 'AUTH:LOGOUT',
})

export const login = (username = '', password = '') => {
  return (dispatch) => {
    dispatch(authLoading(true))
    return Api.post('/user/auth', {
      username,
      password,
    })
    .then((res) => {
      const { data } = res
      dispatch(setAuthToken(data.token))
      dispatch(accountSetData(data.user))
      dispatch(authLoading(false))
      return res
    })
    .catch((err) => {
      const { data } = err
      dispatch(authLoading(false))
      dispatch(loginFormError(data.message))
      return err
    })
  }
}

export const startLogout = () => {
  return (dispatch, getState) => {
    const originalState = getState()
    dispatch(logout())
    dispatch(setAuthToken())
    const promise = new Promise((resolve, reject) => {
      const state = getState()
      if (!state.account || !state.account.authToken || !state.account.authToken.length) {
        resolve({
          status: 200,
          success: true,
          message: `User ${originalState.account.user.username} logged off!`,
        })
      } else {
        reject({
          status: 500,
          success: false,
          message: `Error loggin of user: ${originalState.account.user.username}`,
        })
      }
    })
    return promise
  }
}
