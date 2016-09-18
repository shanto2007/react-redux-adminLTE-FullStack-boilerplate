import Api from 'Http'
import { openToastr } from './toastr.action'

export const usersLoading = (loading = false) => {
  return {
    type: 'USERS_LOADING',
    loading,
  }
}

export const usersSuccess = (success = false) => {
  return {
    type: 'USERS_SUCCESS',
    success,
  }
}

export const usersFail = (fail = false) => {
  return {
    type: 'USERS_FAIL',
    fail,
  }
}

export const usersSetData = (users) => {
  return {
    type: 'USERS_SET_DATA',
    users,
  }
}

export const startGetUsersList = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(usersLoading(true))
    return Api.get('/users', {
      headers: {
        Authorization: state.account.authToken,
      },
    })
    .then((res) => {
      dispatch(usersSetData(res.data.users))
      dispatch(usersLoading(false))
      dispatch(usersSuccess(true))
      return res
    })
    .catch((err) => {
      dispatch(usersLoading(false))
      dispatch(usersFail(true))
      console.error(err)
      return err
    })
  }
}

export const startDeleteUser = (userId) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(usersLoading(true))
    return Api.delete(`/user/${userId}`, {
      headers: {
        Authorization: state.account.authToken,
      },
    })
    .then((res) => {
      console.log(res);
      dispatch(openToastr('success', 'User deleted!'))
      dispatch(usersLoading(false))
      dispatch(startGetUsersList())
      return res
    })
    .catch((err) => {
      if (err.status === 403) {
        dispatch(openToastr('error', 'Deleting admin not allowed!'))
      } else {
        dispatch(openToastr('error', 'Error deleting user!'))
      }
      dispatch(usersLoading(false))
      console.error(err)
      return err
    })
  }
}
