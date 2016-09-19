const defaultToasterState = {
  toastrType: null,
  title: '',
  message: '',
}
export const toastr = (state = defaultToasterState, action) => {
  switch (action.type) {
    case 'TOASTR_OPEN':
      return {
        ...state,
        toastrType: action.toastrType,
        title: action.title,
        message: action.message,
      }
    case 'TOASTR_CLOSE':
      return defaultToasterState
    default:
      return state
  }
}
