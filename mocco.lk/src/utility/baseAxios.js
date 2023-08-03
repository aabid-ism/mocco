import axios from "axios";

const BACKEND_URL = "https://mocco.azurewebsites.net";
// const BACKEND_URL = "http://localhost:5555";
const baseAxios = axios.create({
  baseURL: BACKEND_URL,
  timeout: 50000, // timeout of 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseAxios;
