import Api from 'Http'
import { openToastr } from 'toastr.action'

export const setAdminSeasons = (seasons) => {
  return {
    type: 'SET_ADMIN_SEASONS',
    seasons,
  }
}

export const setAdminCurrentSeason = (current) => {
  return {
    type: 'SET_ADMIN_CURRENT_SEASON',
    current,
  }
}

export const adminSeasonLoading = (loading) => {
  return {
    type: 'ADMIN_SEASON_LOADING',
    loading,
  }
}

export const adminSeasonSuccess = (success) => {
  return {
    type: 'ADMIN_SEASON_SUCCESS',
    success,
  }
}

export const adminSeasonFail = (fail) => {
  return {
    type: 'ADMIN_SEASON_FAIL',
    fail,
  }
}

export const startGetAdminSeasons = () => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminSeasonLoading(true))
    return Api.get('/admin/seasons', {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { seasons } = res.data
      dispatch(setAdminSeasons(seasons))
      dispatch(adminSeasonSuccess(true))
      dispatch(adminSeasonLoading(false))
      return res
    })
    .catch((err) => {
      dispatch(adminSeasonFail(err))
      dispatch(adminSeasonLoading(false))
      return err
    })
  }
}

export const startCreateNewSeason = (year) => {
  return (dispatch, getState) => {
    console.log(">>>>>>>>>>", year)
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminSeasonLoading(true))
    return Api.post('/admin/season', { year }, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      console.log(res)
      dispatch(adminSeasonSuccess(true))
      dispatch(adminSeasonLoading(false))
      dispatch(startGetAdminSeasons(true))
      dispatch(openToastr('success', 'Season created!'))
      return res
    })
    .catch((res) => {
      const err = res.data
      dispatch(adminSeasonFail(err))
      dispatch(adminSeasonLoading(false))
      dispatch(openToastr('error', err.message || 'Error creating a season!'))
      return res
    })
  }
}
