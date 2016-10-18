const defaultAdminDaysState = {
  loading: false,
  success: false,
  fail: '',
  days: [],
}

export const days = (state = defaultAdminDaysState, action) => {
  switch (action.type) {
    case 'SET_ADMIN_DAYS':
      return {
        ...state,
        days: action.days,
      }
    case 'CLEAR_ADMIN_DAYS':
      return {
        ...state,
        days: action.days,
      }
    case 'ADMIN_DAY_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'ADMIN_DAY_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'ADMIN_DAY_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    default:
      return state
  }
}
