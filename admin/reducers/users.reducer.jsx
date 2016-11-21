const defaultUsersState = {
  users: [],
  success: null,
  fail: null,
  loading: false,
}

export const users = (state = defaultUsersState, action) => {
  switch (action.type) {
    case 'USERS_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'USERS_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'USERS_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    case 'USERS_SET_DATA':
      return {
        ...state,
        users: action.users,
      }
    default:
      return state
  }
}
