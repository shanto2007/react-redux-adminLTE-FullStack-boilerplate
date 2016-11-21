export const setEditorData = (data = '') => {
  return {
    type: 'SET_EDITOR_DATA',
    data,
  }
}

export const clearEditorData = () => {
  return {
    type: 'CLEAR_EDITOR_DATA',
    data: null,
  }
}
