import axios from "axios";
const apiUrl = "https://192.168.11.109:9090/";

const apiMarko = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  responseType: "json",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
  },
  paramsSerializer: {
    indexes: null,
    encode: (param) => encodeURIComponent(param).replaceAll("%24", "$"),
  },
});

apiMarko.interceptors.request.use((config) => {
  config.headers.Accept = `application/json`;

  return config;
});

export default apiMarko;
