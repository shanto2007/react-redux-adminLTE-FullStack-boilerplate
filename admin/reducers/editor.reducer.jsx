/**
 *  EDITOR DATA REDUCER
 */
const defaultEditorState = {
  data: null,
}
export const editor = (state = defaultEditorState, action) => {
  switch (action.type) {
    case 'SET_EDITOR_DATA':
      return {
        ...state,
        data: action.data,
      }
    case 'CLEAR_EDITOR_DATA':
      return {
        ...state,
        data: action.data || null,
      }
    default:
      return state

  }
}
