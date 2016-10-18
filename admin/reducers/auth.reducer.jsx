/**
 * ACCOUNT DATA REDUCER
 */

const defaultAuthState = {
  loading: false,
  success: null,
  fail: null,
  formError: '',
}
export const auth = (state = defaultAuthState, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'AUTH_LOGIN_FORM_ERROR':
      return {
        ...state,
        formError: action.formError,
      }
    case 'AUTH_LOGOUT':
      return state
    default:
      return state

  }
}
