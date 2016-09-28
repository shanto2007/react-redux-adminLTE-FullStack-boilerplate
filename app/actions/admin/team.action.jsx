import Api from 'Http'
import { openToastr } from './toastr.action'

export const setAdminTeam = (team) => {
  return {
    type: 'SET_ADMIN_SINGLE_TEAM',
    team,
  }
}

export const clearAdminTeam = (team = null) => {
  return {
    type: 'CLEAR_ADMIN_SINGLE_TEAM',
    team,
  }
}

export const adminTeamLoading = (loading) => {
  return {
    type: 'ADMIN_SINGLE_TEAM_LOADING',
    loading,
  }
}

export const adminTeamSuccess = (success) => {
  return {
    type: 'ADMIN_SINGLE_TEAM_SUCCESS',
    success,
  }
}

export const adminTeamFail = (fail) => {
  return {
    type: 'ADMIN_SINGLE_TEAM_FAIL',
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

export const startEditAdminSingleTeamName = (teamId, newName) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminTeamLoading(true))
    return Api.patch(`/admin/team/${teamId}`, {
      name: newName,
    }, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { team } = res.data
      dispatch(setAdminTeam(team))
      dispatch(adminTeamSuccess(true))
      dispatch(adminTeamLoading(false))
      dispatch(openToastr('success', 'Team name edited!'))
      return res
    })
    .catch((err) => {
      dispatch(adminTeamFail(err))
      dispatch(adminTeamLoading(false))
      dispatch(openToastr('error', err.data.message || 'Error editing team name!'))
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
      console.error(err)
      dispatch(adminTeamFail(err))
      dispatch(adminTeamLoading(false))
      dispatch(openToastr('error', err.message || 'Error creating player!'))
      return err
    })
  }
}

export const startDeletePlayer = (playerId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminTeamLoading(true))
    return Api.delete(`/admin/player/${playerId}`, {
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
      dispatch(adminTeamFail(err))
      dispatch(adminTeamLoading(false))
      dispatch(openToastr('error', err.message || 'Error deleting player!'))
      return err
    })
  }
}
