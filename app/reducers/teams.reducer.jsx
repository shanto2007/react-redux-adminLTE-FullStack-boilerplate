const defaultAdminTeamsState = {
  loading: false,
  success: false,
  fail: '',
  teams: [],
}

export const teams = (state = defaultAdminTeamsState, action) => {
  switch (action.type) {
    case 'SET_ADMIN_TEAMS':
      return {
        ...state,
        teams: action.teams,
      }
    case 'CLEAR_ADMIN_TEAMS':
      return {
        ...state,
        teams: action.teams,
      }
    case 'ADMIN_TEAMS_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'ADMIN_TEAMS_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'ADMIN_TEAMS_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    default:
      return state
  }
}
