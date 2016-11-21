import Api from 'utils/Http'
import { openToastr } from './toastr.action'

export const settingsFetching = (fetching = false) => {
  return {
    type: 'SETTING_FETCHING',
    fetching,
  }
}

export const setSettings = (settings = {}) => {
  return {
    type: 'SET_SETTINGS',
    settings,
  }
}
export const startGetSettings = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(settingsFetching(true))
    return Api.get('/setting', {
      headers: {
        Authorization: state.account.authToken,
      },
    })
    .then((res) => {
      dispatch(settingsFetching(false))
      dispatch(setSettings(res.data.settings))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      console.error(data)
      dispatch(settingsFetching(false))
      return data
    })
  }
}

export const startSaveSettings = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(settingsFetching(true))
    return Api.patch('/setting', { ...state.settings.settings }, {
      headers: {
        Authorization: state.account.authToken,
      },
    })
    .then((res) => {
      dispatch(settingsFetching(false))
      dispatch(setSettings(res.data.settings))
      dispatch(openToastr('success', 'Setting changed!'))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      console.error(data)
      dispatch(settingsFetching(false))
      dispatch(openToastr('error', 'Error saving settings!'))
      return data
    })
  }
}
