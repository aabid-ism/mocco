import axios from "axios";

const BACKEND_URL = "https://mocco.onrender.com";
const baseAxios = axios.create({
  baseURL: BACKEND_URL,
  timeout: 50000, // timeout of 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseAxios;
