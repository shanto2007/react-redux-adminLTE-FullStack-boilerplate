import Api from 'Http'
import { setAuthToken } from 'account.action'
import { openToastr } from 'toastr.action'

/**
 * SIGNIN ACTIONS
 */
export const signinFetching = (fetching) => ({
  type: 'SIGNIN_FETCHING',
  fetching,
})

export const usernameExist = (exist) => ({
  type: 'NEW_USERNAME_EXIST',
  exist,
})

export const validPassword = (valid) => ({
  type: 'VALID_PASSWORD',
  valid,
})

export const validPasswordCheck = (valid) => ({
  type: 'VALID_PASSWORD_CHECK',
  valid,
})

export const signinUsernameError = (error) => ({
  type: 'SIGNIN_USERNAME_ERROR',
  error,
})

export const signinPasswordError = (error) => ({
  type: 'SIGNIN_PASSWORD_ERROR',
  error,
})

export const signInSuccess = (success) => ({
  type: 'SIGNIN_SUCCESSFUL',
  success,
})

export const checkUserExist = (username = '') => {
  return (dispatch) => {
    Api
      .get(`/user/${username}/exist`)
      .then((res) => {
        const { data } = res
        dispatch(usernameExist(data.exist))
        return res
      })
      .catch((err) => {
        const { data } = err
        dispatch(usernameExist(data.exist))
        dispatch(signinUsernameError('Username exist'))
        console.error(err)
        return err
      })
  }
}

export const startSignin = (username, password) => {
  return (dispatch) => {
    signinFetching(true)
    return Api.post('/user', {
      username,
      password,
    })
    .then((res) => {
      dispatch(signinFetching(false))
      dispatch(setAuthToken(res.data.token))
      dispatch(signInSuccess(true))
      return res
    })
    .catch((err) => {
      console.error(err.data)
      dispatch(signinFetching(false))
      dispatch(openToastr('error', err.data.message))
      dispatch(signinUsernameError(err.data.message))
      dispatch(signInSuccess(false))
      return err
    })
  }
}
