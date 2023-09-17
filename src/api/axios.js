import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/api_v1/'
// const BASE_URL = 'https://herculex.my.id/api_v1/'

export default axios.create({
  baseURL: BASE_URL
})

export const axiosPrivate =  axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type' : 'application/json'}
})