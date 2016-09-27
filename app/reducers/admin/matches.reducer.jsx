const defaultAdminMatchesState = {
  loading: false,
  success: false,
  fail: '',
  matches: [],
}

export const matches = (state = defaultAdminMatchesState, action) => {
  switch (action.type) {
    case 'SET_ADMIN_MATCHES':
      return {
        ...state,
        matches: action.matches,
      }
    case 'CLEAR_ADMIN_MATCHES':
      return {
        ...state,
        matches: action.matches,
      }
    case 'ADMIN_MATCHES_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'ADMIN_MATCHES_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'ADMIN_MATCHES_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    default:
      return state
  }
}
