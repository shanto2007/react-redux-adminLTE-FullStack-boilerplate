import Api from 'Http'
import { openToastr } from 'toastr.action'

export const postLoading = (loading = false) => ({
  type: 'POST_LOADING',
  loading,
})

export const postSuccess = (success) => ({
  type: 'POST_SUCCESS',
  success,
})

export const postFail = (fail) => ({
  type: 'POST_FAIL',
  fail,
})

export const setPosts = (posts = []) => ({
  type: 'SET_POSTS',
  posts,
})

export const clearPosts = (posts = []) => ({
  type: 'CLEAR_POSTS',
  posts,
})

export const setSinglePost = (post = {}) => ({
  type: 'SET_SINGLE_POST',
  post,
})

export const clearSinglePost = (post = {}) => ({
  type: 'SET_SINGLE_POST',
  post,
})

export const startGetPosts = () => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(postLoading(true))
    return Api.get('/admin/posts', {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      dispatch(setPosts(res.data.posts))
      return res
    })
    .catch((err) => {
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}

export const startGetSinglePost = (postId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(postLoading(true))
    return Api.get(`/admin/post/${postId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      dispatch(setSinglePost(res.data.post))
      return res
    })
    .catch((err) => {
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}

export const startSavePost = (post) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(postLoading(true))
    return Api.post('/admin/post', post, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(openToastr('success', 'Post saved!'))
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      return res
    })
    .catch((err) => {
      const { data } = err.response
      dispatch(openToastr('error', data.message || 'Some error occured.'))
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}

export const startDeletePost = (postId) => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    dispatch(postLoading(true))
    return Api.delete(`/admin/post/${postId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      return res
    })
    .catch((err) => {
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err.response
    })
  }
}
