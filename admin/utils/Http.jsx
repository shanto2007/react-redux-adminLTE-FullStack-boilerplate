// import { browserHistory } from 'react-router'
// import Toastr from 'toastr';
import axios from 'axios'

const Api = axios.create({
  baseURL: process.env.API_URL,
});

Api.interceptors.response.use((config) => config, (error) => {
  if (String(error.status).match(/(403|401)/)) {
    // Toastr.error('Not Authorized!');
    // browserHistory.push('/login'); >> loop on startup don't do it find a better way.
  }
  return Promise.reject(error);
});

export default Api;
