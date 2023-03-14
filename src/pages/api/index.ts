import axios from "axios";
import humps from "humps";

export const api = axios.create({
  baseURL: "https://member-wannabe-api.wonderland.engineering/",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  timeout: 3000,
  transformRequest: data => {
    return JSON.stringify(humps.decamelizeKeys(data, { separator: "-" }));
  },
  transformResponse: data => humps.camelizeKeys(JSON.parse(data)),
});
