import axios from "axios";

const instance = axios.create({
  baseURL: "https://mocco.azurewebsites.net",
  // baseURL: "http://localhost:5555",
});

export default instance;
