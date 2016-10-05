import Api from 'Http'
import { startGetAdminMatches } from 'actions'
import { openToastr } from './toastr.action'

export const setAdminMatch = (match) => {
  return {
    type: 'SET_ADMIN_MATCH',
    match,
  }
}

export const clearAdminMatch = (match = null) => {
  return {
    type: 'CLEAR_ADMIN_MATCH',
    match,
  }
}

export const adminMatchLoading = (loading) => {
  return {
    type: 'ADMIN_MATCH_LOADING',
    loading,
  }
}

export const adminMatchSuccess = (success) => {
  return {
    type: 'ADMIN_MATCH_SUCCESS',
    success,
  }
}

export const adminMatchFail = (fail) => {
  return {
    type: 'ADMIN_MATCH_FAIL',
    fail,
  }
}

export const startCreateNewMatch = (match) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminMatchLoading(true))
    return Api.post('/admin/match/', match, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Match created!'))
      dispatch(adminMatchSuccess(true))
      dispatch(adminMatchLoading(false))
      return res
    })
    .catch((err) => {
      console.error(err)
      dispatch(adminMatchFail(err))
      dispatch(adminMatchLoading(false))
      dispatch(openToastr('error', err.data.message || 'Error creating match!'))
      return err
    })
  }
}

export const startGetAdminSingleMatch = (matchId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminMatchLoading(true))
    return Api.get(`/admin/match/${matchId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { match } = res.data
      dispatch(setAdminMatch(match))
      dispatch(adminMatchSuccess(true))
      dispatch(adminMatchLoading(false))
      return res
    })
    .catch((err) => {
      console.error(err)
      dispatch(adminMatchFail(err))
      dispatch(adminMatchLoading(false))
      dispatch(openToastr('error', err.data.message || 'Error fetching match!'))
      return err
    })
  }
}

export const startEditAdminMatch = (matchId, matchData) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminMatchLoading(true))
    return Api.patch(`/admin/match/${matchId}`, matchData, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { match } = res.data
      dispatch(startGetAdminSingleMatch(match._id))
      dispatch(adminMatchSuccess(true))
      dispatch(adminMatchLoading(false))
      dispatch(openToastr('success', 'Match Updated!'))
      return res
    })
    .catch((err) => {
      console.error(err)
      dispatch(adminMatchFail(err))
      dispatch(adminMatchLoading(false))
      dispatch(openToastr('error', err.message || 'Error editing match!'))
      return err
    })
  }
}

export const startResetAdminMatch = (matchId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminMatchLoading(true))
    return Api.patch(`/admin/match/${matchId}/reset`, null, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { match } = res.data
      dispatch(startGetAdminSingleMatch(match._id))
      dispatch(adminMatchSuccess(true))
      dispatch(adminMatchLoading(false))
      dispatch(openToastr('success', 'Match data resetted!'))
      return res
    })
    .catch((err) => {
      dispatch(adminMatchFail(err))
      dispatch(adminMatchLoading(false))
      dispatch(openToastr('error', err.message || 'Error resetting match data!'))
      return err
    })
  }
}

export const startDeleteMatch = (matchId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminMatchLoading(true))
    return Api.delete(`/admin/match/${matchId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { match } = res.data
      dispatch(startGetAdminMatches(match.round))
      dispatch(adminMatchSuccess(true))
      dispatch(adminMatchLoading(false))
      dispatch(openToastr('success', 'Match deleted!'))
      return res
    })
    .catch((err) => {
      dispatch(adminMatchFail(err))
      dispatch(adminMatchLoading(false))
      dispatch(openToastr('error', err.message || 'Error deleting player!'))
      return err
    })
  }
}
