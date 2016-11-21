/**
 * ACCOUNT DATA REDUCER
 */

const defaultAccountState = {
  authToken: null,
  checkPassword: null,
  checkEmailExist: null,
  user: {
    username: null,
    id: null,
  },
  loading: false,
  success: null,
  fail: null,
}
export const account = (state = defaultAccountState, action) => {
  switch (action.type) {
    case 'ACCOUNT_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'ACCOUNT_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'ACCOUNT_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    case 'ACCOUNT_SET_AUTH_TOKEN':
      return {
        ...state,
        authToken: action.authToken,
      }
    case 'ACCOUNT_SET_USER_DATA':
      return {
        ...state,
        user: action.user,
      }
    case 'ACCOUNT_CHECK_PASSWORD':
      return {
        ...state,
        checkPassword: action.check,
      }
    case 'ACCOUNT_CHECK_EMAIL_EXIST':
      return {
        ...state,
        checkEmailExist: action.check,
      }
    default:
      return state

  }
}
