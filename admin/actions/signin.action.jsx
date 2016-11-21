import Api from 'utils/Http'
import { setAuthToken } from './account.action'
import { openToastr } from './toastr.action'

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

export const emailExist = (exist) => ({
  type: 'NEW_USERNAME_EMAIL_EXIST',
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

export const signinUsernameError = (error = null) => ({
  type: 'SIGNIN_USERNAME_ERROR',
  error,
})

export const signinEmailError = (error = null) => ({
  type: 'SIGNIN_EMAIL_ERROR',
  error,
})

export const signinPasswordError = (error) => ({
  type: 'SIGNIN_PASSWORD_ERROR',
  error,
})

export const signinPasswordCheckError = (error) => ({
  type: 'SIGNIN_PASSWORD_CHECK_ERROR',
  error,
})

export const signInSuccess = (success) => ({
  type: 'SIGNIN_SUCCESSFUL',
  success,
})

export const checkUserExist = (username = '') => {
  return (dispatch) => {
    Api
      .get(`/user/username/${username}/exist`)
      .then((res) => {
        const { data } = res
        dispatch(usernameExist(data.exist))
        dispatch(signinUsernameError())
        return res
      })
      .catch((err) => {
        const { data } = err.response
        dispatch(usernameExist(data.exist))
        dispatch(signinUsernameError('Username exist'))
        return data
      })
  }
}

export const checkEmailExist = (email = '') => {
  return (dispatch) => {
    Api
      .get(`/user/email/${email}/exist`)
      .then((res) => {
        const { data } = res
        dispatch(emailExist(data.exist))
        dispatch(signinEmailError())
        return res
      })
      .catch((err) => {
        const { data } = err.response
        dispatch(emailExist(data.exist))
        dispatch(signinEmailError('Email exist'))
        return data
      })
  }
}

export const startSignin = (username, password, email) => {
  return (dispatch) => {
    signinFetching(true)
    return Api.post('/user', {
      username,
      password,
      email,
    })
    .then((res) => {
      dispatch(signinFetching(false))
      dispatch(setAuthToken(res.data.token))
      dispatch(signInSuccess(true))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(signinFetching(false))
      dispatch(openToastr('error', data.message))
      dispatch(signinUsernameError(data.message))
      dispatch(signInSuccess(false))
      return data
    })
  }
}
