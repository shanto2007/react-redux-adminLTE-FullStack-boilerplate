const defaultAdminMatchState = {
  loading: false,
  success: false,
  fail: '',
  match: {},
}

export const match = (state = defaultAdminMatchState, action) => {
  switch (action.type) {
    case 'SET_ADMIN_MATCH':
      return {
        ...state,
        match: action.match,
      }
    case 'CLEAR_ADMIN_MATCH':
      return {
        ...state,
        match: action.match,
      }
    case 'ADMIN_MATCH_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'ADMIN_MATCH_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'ADMIN_MATCH_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    default:
      return state
  }
}
