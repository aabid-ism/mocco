import axios from "axios";

const instance = axios.create({
  baseURL: "https://mocco.onrender.com",
});

export default instance;
