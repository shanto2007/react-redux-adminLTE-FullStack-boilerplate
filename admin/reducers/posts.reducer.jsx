const defaultPostState = {
  loading: false,
  success: false,
  fail: '',
  posts: [],
  post: {},
}

export const posts = (state = defaultPostState, action) => {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.posts,
      }
    case 'CLEAR_POSTS':
      return {
        ...state,
        posts: [],
      }
    case 'CLEAR_POST':
      return {
        ...state,
        post: {},
      }
    case 'SET_SINGLE_POST':
      return {
        ...state,
        post: action.post,
      }
    case 'SET_SINGLE_POST_TITLE':
      return {
        ...state,
        post: {
          ...state.post,
          title: action.title,
        },
      }
    case 'SET_SINGLE_POST_BODY':
      return {
        ...state,
        post: {
          ...state.post,
          body: action.body,
        },
      }
    case 'POST_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    case 'POST_SUCCESS':
      return {
        ...state,
        success: action.success,
      }
    case 'POST_FAIL':
      return {
        ...state,
        fail: action.fail,
      }
    default:
      return state
  }
}
