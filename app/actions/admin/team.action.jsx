import Api from 'Http'
import { openToastr } from './toastr.action'

export const setAdminTeam = (team) => {
  return {
    type: 'SET_ADMIN_TEAM',
    team,
  }
}

export const clearAdminTeam = (team = null) => {
  return {
    type: 'CLEAR_ADMIN_TEAM',
    team,
  }
}

export const setAdminTeamPlayers = (players = []) => {
  return {
    type: 'SET_ADMIN_TEAM_PLAYERS',
    players,
  }
}

export const adminTeamLoading = (loading) => {
  return {
    type: 'ADMIN_TEAM_LOADING',
    loading,
  }
}

export const adminTeamSuccess = (success) => {
  return {
    type: 'ADMIN_TEAM_SUCCESS',
    success,
  }
}

export const adminTeamFail = (fail) => {
  return {
    type: 'ADMIN_TEAM_FAIL',
    fail,
  }
}

export const startGetAdminSingleTeam = (teamId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminTeamLoading(true))
    return Api.get(`/admin/team/${teamId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { team } = res.data
      dispatch(setAdminTeam(team))
      dispatch(adminTeamSuccess(true))
      dispatch(adminTeamLoading(false))
      return res
    })
    .catch((err) => {
      dispatch(adminTeamFail(err))
      dispatch(adminTeamLoading(false))
      dispatch(openToastr('error', err.message || 'Error getting team!'))
      return err
    })
  }
}

export const startCreateNewPlayer = (player) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminTeamLoading(true))
    return Api.post('/admin/player/', player, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { player } = res.data
      dispatch(startGetAdminSingleTeam(player.team))
      dispatch(adminTeamSuccess(true))
      dispatch(adminTeamLoading(false))
      return res
    })
    .catch((err) => {
      console.log(err)
      dispatch(adminTeamFail(err))
      dispatch(adminTeamLoading(false))
      dispatch(openToastr('error', err.message || 'Error creating player!'))
      return err
    })
  }
}
