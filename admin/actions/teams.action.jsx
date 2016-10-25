import Api from 'Http'
import { openToastr } from './toastr.action'

export const setAdminTeams = (teams) => {
  return {
    type: 'SET_ADMIN_TEAMS',
    teams,
  }
}

export const clearAdminTeams = (teams = []) => {
  return {
    type: 'CLEAR_ADMIN_TEAMS',
    teams,
  }
}

export const adminTeamsLoading = (loading) => {
  return {
    type: 'ADMIN_TEAMS_LOADING',
    loading,
  }
}

export const adminTeamsSuccess = (success) => {
  return {
    type: 'ADMIN_TEAMS_SUCCESS',
    success,
  }
}

export const adminTeamsFail = (fail) => {
  return {
    type: 'ADMIN_TEAMS_FAIL',
    fail,
  }
}

export const startGetAdminTeams = (round) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminTeamsLoading(true))
    return Api.get(`/admin/teams/${round}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      const { teams } = res.data
      dispatch(setAdminTeams(teams))
      dispatch(adminTeamsSuccess(true))
      dispatch(adminTeamsLoading(false))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(adminTeamsFail(data))
      dispatch(adminTeamsLoading(false))
      dispatch(openToastr('error', data.message || 'Error getting teams!'))
      return data
    })
  }
}

export const startCreateNewTeam = (newTeam) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    if (!newTeam.season) {
      return dispatch(openToastr('error', 'No season selected!'))
    }
    if (!newTeam.round) {
      return dispatch(openToastr('error', 'No round selected!'))
    }
    if (!newTeam.name.length) {
      return dispatch(openToastr('error', 'No team name provided!'))
    }
    dispatch(adminTeamsLoading(true))
    return Api.post('/admin/team', newTeam, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Teams created!'))
      dispatch(adminTeamsSuccess(true))
      dispatch(adminTeamsLoading(false))
      dispatch(startGetAdminTeams(res.data.team.round))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Error creating a season!'))
      dispatch(adminTeamsFail(data))
      dispatch(adminTeamsLoading(false))
      return data
    })
  }
}

export const startDeleteTeam = (teamId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(adminTeamsLoading(true))
    return Api.delete(`/admin/team/${teamId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Team removed!'))
      dispatch(adminTeamsSuccess(true))
      dispatch(adminTeamsLoading(false))
      dispatch(startGetAdminTeams(res.data.team.round))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Error removing the team!'))
      dispatch(adminTeamsFail(data))
      dispatch(adminTeamsLoading(false))
      return data
    })
  }
}
