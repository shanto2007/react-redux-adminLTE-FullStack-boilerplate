import Api from 'lib/Http'

/**
 * ACCOUNT ACTIONS
 */
export const accountLoading = (loading = false) => ({
  type: 'ACCOUNT_LOADING',
  loading,
})

export const accountSuccess = (success = false) => ({
  type: 'ACCOUNT_SUCCESS',
  success,
})

export const accountFail = (fail = false) => ({
  type: 'ACCOUNT_FAIL',
  fail,
})

export const setAuthToken = (authToken = '') => ({
  type: 'ACCOUNT_SET_AUTH_TOKEN',
  authToken,
})

export const accountSetData = (user = {}) => ({
  type: 'ACCOUNT_SET_USER_DATA',
  user,
})

export const getUserData = () => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(accountLoading(true))
    return Api.get('/me', {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(accountLoading(false))
      dispatch(accountSuccess(true))
      dispatch(accountSetData(res.data.user))
      return res
    })
    .catch((res) => {
      // dispatch(accountLoading(false))
      dispatch(accountFail(true))
      dispatch(setAuthToken(''))
      console.error(res)
      return res
    })
  }
}
