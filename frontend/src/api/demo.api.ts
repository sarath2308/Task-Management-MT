import api from "./api";

export const DEMO_API = {
    GET_DEMO_DATA:() => api.get("https://fake-json-api.mock.beeceptor.com/users").then((res)=>res.data),
}