/**
 * TOKEN STORAGE HANDLER
 */
export const authTokenStorageHandler = (authToken) => {
  if (!authToken || !authToken.length) {
    window.localStorage.removeItem('bt');
  } else {
    window.localStorage.setItem('bt', authToken);
  }
}

export const getTokenFromStorage = () => window.localStorage.getItem('bt');

export const setTokenFromStorage = (authToken) => window.localStorage.setItem('bt', authToken);
