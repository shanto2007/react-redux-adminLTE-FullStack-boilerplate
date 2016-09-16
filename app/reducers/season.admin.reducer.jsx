const defaultAdminSeasonState = {
  loading: false,
  success: false,
  fail: '',
  seasons: [],
  current: null,
}

export const seasonAdmin = (state = defaultAdminSeasonState, action) => {
  switch (action.type) {
    case 'SET_ADMIN_SEASONS':
      return {
        ...state,
        seasons: action.seasons,
      }
    case 'SET_ADMIN_CURRENT_SEASON':
      return {
        ...state,
        current: action.current,
      }
    case 'ADMIN_SEASON_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'ADMIN_SEASON_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'ADMIN_SEASON_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    default:
      return state
  }
}
