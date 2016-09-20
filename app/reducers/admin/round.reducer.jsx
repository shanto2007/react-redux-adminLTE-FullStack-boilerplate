const defaultAdminRoundState = {
  loading: false,
  success: false,
  fail: '',
  rounds: [],
}

export const rounds = (state = defaultAdminRoundState, action) => {
  switch (action.type) {
    case 'SET_ADMIN_ROUNDS':
      return {
        ...state,
        rounds: action.rounds,
      }
    case 'CLEAR_ADMIN_ROUNDS':
      return {
        ...state,
        rounds: action.rounds,
      }
    case 'ADMIN_ROUND_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'ADMIN_ROUND_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'ADMIN_ROUND_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    default:
      return state
  }
}
