import Api from 'Http'
import { openToastr } from './toastr.action'

export const setAdminDays = (days) => {
  return {
    type: 'SET_ADMIN_DAYS',
    days,
  }
}

export const clearAdminDays = (days = []) => {
  return {
    type: 'CLEAR_ADMIN_DAYS',
    days,
  }
}

export const adminDaysLoading = (loading) => {
  return {
    type: 'ADMIN_DAY_LOADING',
    loading,
  }
}

export const adminDaysSuccess = (success) => {
  return {
    type: 'ADMIN_DAY_SUCCESS',
    success,
  }
}

export const adminDaysFail = (fail) => {
  return {
    type: 'ADMIN_DAY_FAIL',
    fail,
  }
}

export const startGetAdminDays = (round) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminDaysLoading(true))
    return Api.get(`/admin/days/${round}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { days } = res.data
      dispatch(setAdminDays(days))
      dispatch(adminDaysSuccess(true))
      dispatch(adminDaysLoading(false))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(adminDaysFail(err))
      dispatch(adminDaysLoading(false))
      dispatch(openToastr('error', data.message || 'Error getting days!'))
      return err.response
    })
  }
}

export const startCreateNewDay = (newDay) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    if (!newDay.season) {
      return dispatch(openToastr('error', 'No season selected!'))
    }
    if (!newDay.round) {
      return dispatch(openToastr('error', 'No round selected!'))
    }
    dispatch(adminDaysLoading(true))
    return Api.post('/admin/day', newDay, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Days created!'))
      dispatch(adminDaysSuccess(true))
      dispatch(adminDaysLoading(false))
      dispatch(startGetAdminDays(res.data.day.round))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Error creating a season!'))
      dispatch(adminDaysFail(data))
      dispatch(adminDaysLoading(false))
      return err.response
    })
  }
}

export const startDeleteDay = (dayId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminDaysLoading(true))
    return Api.delete(`/admin/day/${dayId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Day removed!'))
      dispatch(adminDaysSuccess(true))
      dispatch(adminDaysLoading(false))
      dispatch(startGetAdminDays(res.data.day.round))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Error removing the day!'))
      dispatch(adminDaysFail(data))
      dispatch(adminDaysLoading(false))
      return err.response
    })
  }
}
