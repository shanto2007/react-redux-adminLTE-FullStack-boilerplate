import Api from 'Http'

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

export const setSingleMail = (post = {}) => ({
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
      return res;
    })
    .catch((err) => {
      console.error(err)
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err;
    })
  }
}

export const startSavePost = () => {
  return (dispatch, getState) => {
    const store = getState()
    const authToken = store.account.authToken
    const { post } = store.posts
    dispatch(postLoading(true))
    return Api.post('/admin/post', post, {
      headers: {
        Authorization: authToken,
      },
    })
    .then((res) => {
      dispatch(postLoading(false))
      dispatch(postSuccess(true))
      dispatch(setSingleMail(res.data.post))
      return res;
    })
    .catch((err) => {
      console.error(err)
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err;
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
      dispatch(setSingleMail(res.data.post))
      return res;
    })
    .catch((err) => {
      console.error(err)
      dispatch(postLoading(false))
      dispatch(postFail(true))
      return err;
    })
  }
}
