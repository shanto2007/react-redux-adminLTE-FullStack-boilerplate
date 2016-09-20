import Api from 'Http'
import { openToastr } from './toastr.action'

export const setAdminRounds = (rounds) => {
  return {
    type: 'SET_ADMIN_ROUNDS',
    rounds,
  }
}

export const clearAdminRounds = (rounds = []) => {
  return {
    type: 'CLEAR_ADMIN_ROUNDS',
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
    if (!season && !store.seasons.viewed) {
      dispatch(openToastr('error', 'No Season selected!', 'Select a season plase!'))
      dispatch(setAdminRounds([]))
      dispatch(adminRoundsSuccess(false))
      dispatch(adminRoundsFail('No Season provided'))
      dispatch(adminRoundsLoading(false))
      return null
    } else if (!season && store.seasons.viewed._id) {
      season = store.seasons.viewed._id
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

export const startCreateNewRounds = (newRound) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    if (!newRound.season) {
      return dispatch(openToastr('error', 'No season selected!'))
    }
    dispatch(adminRoundsLoading(true))
    return Api.post('/admin/round', newRound, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Rounds created!'))
      dispatch(adminRoundsSuccess(true))
      dispatch(adminRoundsLoading(false))
      dispatch(startGetAdminRounds(res.data.round.season))
      return res
    })
    .catch((res) => {
      const err = res.data
      dispatch(openToastr('error', err.message || 'Error creating a season!'))
      dispatch(adminRoundsFail(err))
      dispatch(adminRoundsLoading(false))
      return res
    })
  }
}

export const startDeleteRound = (roundId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminRoundsLoading(true))
    return Api.delete(`/admin/round/${roundId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Round removed!'))
      dispatch(adminRoundsSuccess(true))
      dispatch(adminRoundsLoading(false))
      dispatch(startGetAdminRounds(res.data.round.season))
      return res
    })
    .catch((res) => {
      const err = res.data
      dispatch(openToastr('error', err.message || 'Error removing the round!'))
      dispatch(adminRoundsFail(err))
      dispatch(adminRoundsLoading(false))
      return res
    })
  }
}
