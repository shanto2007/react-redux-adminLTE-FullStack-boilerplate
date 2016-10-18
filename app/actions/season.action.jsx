import Api from 'Http'
import { openToastr } from './toastr.action'

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

export const setAdminViewedSeason = (viewed) => {
  return {
    type: 'SET_ADMIN_VIEWED_SEASON',
    viewed,
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

export const startGetCurrentSeason = () => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminSeasonLoading(true))
    return Api.get('/admin/season/current', {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(setAdminCurrentSeason(res.data.season))
      dispatch(setAdminViewedSeason(res.data.season))
      dispatch(adminSeasonSuccess(true))
      dispatch(adminSeasonLoading(false))
      return res
    })
    .catch((res) => {
      const err = res.data
      dispatch(openToastr('error', err.message || 'Error getting season as current!'))
      dispatch(adminSeasonFail(err))
      dispatch(adminSeasonLoading(false))
      return res
    })
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
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminSeasonLoading(true))
    return Api.post('/admin/season', { year }, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Season created!'))
      dispatch(adminSeasonSuccess(true))
      dispatch(adminSeasonLoading(false))
      dispatch(startGetAdminSeasons())
      dispatch(startGetCurrentSeason())
      return res
    })
    .catch((res) => {
      const err = res.data
      dispatch(openToastr('error', err.message || 'Error creating a season!'))
      dispatch(adminSeasonFail(err))
      dispatch(adminSeasonLoading(false))
      return res
    })
  }
}

export const startDeleteSeason = (seasonId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminSeasonLoading(true))
    return Api.delete(`/admin/season/${seasonId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Season removed!'))
      dispatch(adminSeasonSuccess(true))
      dispatch(adminSeasonLoading(false))
      dispatch(startGetAdminSeasons())
      dispatch(startGetCurrentSeason())
      return res
    })
    .catch((res) => {
      const err = res.data
      dispatch(openToastr('error', err.message || 'Error removing season!'))
      dispatch(adminSeasonFail(err))
      dispatch(adminSeasonLoading(false))
      return res
    })
  }
}

export const startSetCurrentSeason = (seasonId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminSeasonLoading(true))
    return Api.patch(`/admin/season/${seasonId}/current`, null, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Season set as current!'))
      dispatch(setAdminCurrentSeason(res.data.season))
      dispatch(adminSeasonSuccess(true))
      dispatch(adminSeasonLoading(false))
      dispatch(startGetAdminSeasons())
      dispatch(startGetCurrentSeason())
      return res
    })
    .catch((res) => {
      const err = res.data
      dispatch(openToastr('error', err.message || 'Error setting season as current!'))
      dispatch(adminSeasonFail(err))
      dispatch(adminSeasonLoading(false))
      return res
    })
  }
}
