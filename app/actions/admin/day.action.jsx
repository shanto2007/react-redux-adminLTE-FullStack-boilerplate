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

export const startGetAdminDays = (season) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminDaysLoading(true))
    if (!season && !store.seasons.viewed) {
      dispatch(openToastr('error', 'No Season selected!', 'Select a season plase!'))
      dispatch(setAdminDays([]))
      dispatch(adminDaysSuccess(false))
      dispatch(adminDaysFail('No Season provided'))
      dispatch(adminDaysLoading(false))
      return null
    } else if (!season && store.seasons.viewed._id) {
      season = store.seasons.viewed._id
    }
    return Api.get(`/admin/days/${season}`, {
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
      dispatch(adminDaysFail(err))
      dispatch(adminDaysLoading(false))
      dispatch(openToastr('error', err.message || 'Error getting days!'))
      return err
    })
  }
}

export const startCreateNewDays = (newDay) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    if (!newDay.season) {
      return dispatch(openToastr('error', 'No season selected!'))
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
      dispatch(startGetAdminDays(res.data.day.season))
      return res
    })
    .catch((res) => {
      const err = res.data
      dispatch(openToastr('error', err.message || 'Error creating a season!'))
      dispatch(adminDaysFail(err))
      dispatch(adminDaysLoading(false))
      return res
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
      dispatch(startGetAdminDays(res.data.day.season))
      return res
    })
    .catch((res) => {
      const err = res.data
      dispatch(openToastr('error', err.message || 'Error removing the day!'))
      dispatch(adminDaysFail(err))
      dispatch(adminDaysLoading(false))
      return res
    })
  }
}
