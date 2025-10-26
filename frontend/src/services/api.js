import axios from "axios";

const API = axios.create({ baseURL: "/api" });

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getTracks = () => API.get("/tracks");
