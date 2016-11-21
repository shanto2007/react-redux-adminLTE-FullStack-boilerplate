/**
 * SIGNIN REDUCER
 */

const defaultSigninState = {
  error: null,
  fetching: false,
  username: undefined,
  password: undefined,
  usernameExist: false,
  emailExist: false,
  validPassword: null,
  validPasswordCheck: null,
  passwordError: null,
  passwordCheckError: null,
  success: null,
}
export const signin = (state = defaultSigninState, action) => {
  switch (action.type) {
    case 'SIGNIN_USERNAME_ERROR':
      return {
        ...state,
        usernameError: action.error,
      }
    case 'SIGNIN_EMAIL_ERROR':
      return {
        ...state,
        emailError: action.error,
      }
    case 'SIGNIN_PASSWORD_ERROR':
      return {
        ...state,
        passwordError: action.error,
      }
    case 'SIGNIN_PASSWORD_CHECK_ERROR':
      return {
        ...state,
        passwordCheckError: action.error,
      }
    case 'SIGNIN_FETCHING':
      return {
        ...state,
        fetching: action.fetching,
      }
    case 'GET_NEW_USER_DATA':
      return {
        ...state,
        username: action.username,
        password: action.password,
      }
    case 'NEW_USERNAME_EXIST':
      return {
        ...state,
        usernameExist: action.exist,
      }
    case 'NEW_USERNAME_EMAIL_EXIST':
      return {
        ...state,
        emailExist: action.exist,
      }
    case 'VALID_PASSWORD':
      return {
        ...state,
        validPassword: action.valid,
      }
    case 'VALID_PASSWORD_CHECK':
      return {
        ...state,
        validPasswordCheck: action.valid,
      }
    case 'SIGNIN_SUCCESSFUL':
      return {
        ...state,
        success: action.success,
      }
    default:
      return state

  }
}
