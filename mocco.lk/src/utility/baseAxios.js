import axios from "axios";

const BACKEND_URL = "http://localhost:5555";
const baseAxios = axios.create({
  baseURL: `${BACKEND_URL}`,
  timeout: 10000, // timeout of 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseAxios;
