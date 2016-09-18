const defaultAdminSeasonState = {
  loading: false,
  success: false,
  fail: '',
  seasons: [],
  current: null,
  viewed: null,
}

export const seasons = (state = defaultAdminSeasonState, action) => {
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
    case 'SET_ADMIN_VIEWED_SEASON':
      return {
        ...state,
        viewed: action.viewed,
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
