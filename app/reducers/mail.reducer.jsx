const defaultMailState = {
  mail: {},
  success: null,
  fail: null,
  loading: false,
}
export const mail = (state = defaultMailState, action) => {
  switch (action.type) {
    case 'SET_MAIL':
      return {
        ...state,
        mail: action.mail,
      }
    case 'MAIL_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'MAIL_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'MAIL_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    default:
      return state
  }
}
