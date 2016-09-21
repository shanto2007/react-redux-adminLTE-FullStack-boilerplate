const defaultAdminTeamState = {
  loading: false,
  success: false,
  fail: '',
  team: null,
}

export const team = (state = defaultAdminTeamState, action) => {
  switch (action.type) {
    case 'SET_ADMIN_TEAM':
      return {
        ...state,
        team: action.team,
      }
    case 'CLEAR_ADMIN_TEAM':
      return {
        ...state,
        team: null,
      }
    case 'ADMIN_TEAM_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'ADMIN_TEAM_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'ADMIN_TEAM_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    default:
      return state
  }
}
