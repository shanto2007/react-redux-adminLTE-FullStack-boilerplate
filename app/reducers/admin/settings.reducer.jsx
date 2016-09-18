const defaultSettingState = {
  loading: false,
  settings: {},
}

export const settings = (state = defaultSettingState, action) => {
  switch (action.type) {
    case 'SETTING_FETCHING':
      return {
        ...state,
        loading: action.fetching,
      }
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.settings,
      }
    default:
      return state
  }
}
