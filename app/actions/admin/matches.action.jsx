import Api from 'Http'
import { openToastr } from './toastr.action'

export const setAdminMatches = (matches = []) => {
  return {
    type: 'SET_ADMIN_MATCHES',
    matches,
  }
}

export const clearAdminMatches = (matches = null) => {
  return {
    type: 'CLEAR_ADMIN_MATCHES',
    matches,
  }
}

export const adminMatchesLoading = (loading) => {
  return {
    type: 'ADMIN_MATCHES_LOADING',
    loading,
  }
}

export const adminMatchesSuccess = (success) => {
  return {
    type: 'ADMIN_MATCHES_SUCCESS',
    success,
  }
}

export const adminMatchesFail = (fail = 'Something went orribly wrong') => {
  return {
    type: 'ADMIN_MATCHES_FAIL',
    fail,
  }
}

export const startGetAdminMatches = (roundId) => {
  console.log("AOOO22222")
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminMatchesLoading(true))
    return Api.get(`/admin/matches/${roundId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { matches } = res.data
      dispatch(setAdminMatches(matches))
      dispatch(adminMatchesSuccess(true))
      dispatch(adminMatchesLoading(false))
      return res
    })
    .catch((err) => {
      console.error(err)
      dispatch(adminMatchesFail(err))
      dispatch(adminMatchesLoading(false))
      dispatch(openToastr('error', err.data.message || 'Error creating matches!'))
      return err
    })
  }
}
