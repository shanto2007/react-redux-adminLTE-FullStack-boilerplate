export const router = (state = { route: undefined }, action) => {
  switch (action.type) {
    case 'ADMIN_CHANGE_ROUTE':
      return {
        route: action.route,
      }
    default:
      return state

  }
}
