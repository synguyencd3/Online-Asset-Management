import axios from "axios";
import { LogInModel } from "../models/LogInModel";
import { CORS_CONFIG } from "../configs/CorsConfig";

const AUTH_SERVICE_API = 'http://localhost:8080/api/v1/auth';

export const login = async (data: LogInModel) => await axios.post(`${AUTH_SERVICE_API}/signIn`, data, CORS_CONFIG);
export const logout = async () => await axios.post(`${AUTH_SERVICE_API}/logout`, null, CORS_CONFIG);