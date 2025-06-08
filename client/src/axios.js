import axios from 'axios';

axios.defaults.baseURL = '/api';  //  用代理路径，不写死 3000
axios.defaults.withCredentials = true;

export default axios;