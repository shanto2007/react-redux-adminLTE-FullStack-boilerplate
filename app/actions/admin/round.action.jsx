import Api from 'Http'
import { openToastr } from './toastr.action'

export const setAdminRounds = (rounds) => {
  return {
    type: 'SET_ADMIN_ROUNDS',
    rounds,
  }
}

export const adminRoundsLoading = (loading) => {
  return {
    type: 'ADMIN_ROUND_LOADING',
    loading,
  }
}

export const adminRoundsSuccess = (success) => {
  return {
    type: 'ADMIN_ROUND_SUCCESS',
    success,
  }
}

export const adminRoundsFail = (fail) => {
  return {
    type: 'ADMIN_ROUND_FAIL',
    fail,
  }
}

export const startGetAdminRounds = (season) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminRoundsLoading(true))
    if (!season) {
      dispatch(openToastr('error', 'No Season selected!', 'Select a season plase!'))
      dispatch(setAdminRounds([]))
      dispatch(adminRoundsSuccess(false))
      dispatch(adminRoundsFail('No Season provided'))
      dispatch(adminRoundsLoading(false))
    }
    return Api.get(`/admin/rounds/${season}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { rounds } = res.data
      dispatch(setAdminRounds(rounds))
      dispatch(adminRoundsSuccess(true))
      dispatch(adminRoundsLoading(false))
      return res
    })
    .catch((err) => {
      dispatch(adminRoundsFail(err))
      dispatch(adminRoundsLoading(false))
      dispatch(openToastr('error', err.message || 'Error getting rounds!'))
      return err
    })
  }
}

// export const startCreateNewRounds = (year) => {
//   return (dispatch, getState) => {
//     const store = getState()
//     const authToken = store.account.authToken
//     dispatch(adminRoundsLoading(true))
//     return Api.post('/admin/season', { year }, {
//       headers: {
//         Authorization: authToken,
//       },
//     })
//     .then((res) => {
//       dispatch(openToastr('success', 'Rounds created!'))
//       dispatch(adminRoundsSuccess(true))
//       dispatch(adminRoundsLoading(false))
//       dispatch(startGetAdminRounds())
//       dispatch(startGetCurrentRounds())
//       return res
//     })
//     .catch((res) => {
//       const err = res.data
//       dispatch(openToastr('error', err.message || 'Error creating a season!'))
//       dispatch(adminRoundsFail(err))
//       dispatch(adminRoundsLoading(false))
//       return res
//     })
//   }
// }

// export const startDeleteRounds = (seasonId) => {
//   return (dispatch, getState) => {
//     const store = getState()
//     const authToken = store.account.authToken
//     dispatch(adminRoundsLoading(true))
//     return Api.delete(`/admin/season/${seasonId}`, {
//       headers: {
//         Authorization: authToken,
//       },
//     })
//     .then((res) => {
//       dispatch(openToastr('success', 'Rounds removed!'))
//       dispatch(adminRoundsSuccess(true))
//       dispatch(adminRoundsLoading(false))
//       dispatch(startGetAdminRounds())
//       dispatch(startGetCurrentRounds())
//       return res
//     })
//     .catch((res) => {
//       const err = res.data
//       dispatch(openToastr('error', err.message || 'Error removing season!'))
//       dispatch(adminRoundsFail(err))
//       dispatch(adminRoundsLoading(false))
//       return res
//     })
//   }
// }
//
