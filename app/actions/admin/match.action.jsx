import Api from 'Http'
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
      const { match } = res.data
      console.log(match)
      // dispatch(startGetAdminSingleMatch(player.match))
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


// export const startGetAdminSingleMatch = (matchId) => {
//   return (dispatch, getState) => {
//     const store = getState()
//     const authToken = store.account.authToken
//     dispatch(adminMatchLoading(true))
//     return Api.get(`/admin/match/${matchId}`, {
//       headers: {
//         Authorization: authToken,
//       },
//     })
//     .then((res) => {
//       const { match } = res.data
//       dispatch(setAdminMatch(match))
//       dispatch(adminMatchSuccess(true))
//       dispatch(adminMatchLoading(false))
//       return res
//     })
//     .catch((err) => {
//       dispatch(adminMatchFail(err))
//       dispatch(adminMatchLoading(false))
//       dispatch(openToastr('error', err.message || 'Error getting match!'))
//       return err
//     })
//   }
// }

// export const startDeletePlayer = (playerId) => {
//   return (dispatch, getState) => {
//     const store = getState()
//     const authToken = store.account.authToken
//     dispatch(adminMatchLoading(true))
//     return Api.delete(`/admin/player/${playerId}`, {
//       headers: {
//         Authorization: authToken,
//       },
//     })
//     .then((res) => {
//       const { player } = res.data
//       dispatch(startGetAdminSingleMatch(player.match))
//       dispatch(adminMatchSuccess(true))
//       dispatch(adminMatchLoading(false))
//       return res
//     })
//     .catch((err) => {
//       dispatch(adminMatchFail(err))
//       dispatch(adminMatchLoading(false))
//       dispatch(openToastr('error', err.message || 'Error deleting player!'))
//       return err
//     })
//   }
// }
