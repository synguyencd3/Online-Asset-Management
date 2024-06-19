import axios from "axios";
import { LogInModel } from "../models/LogInModel";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../configs/CorsConfig";
import { ChangePasswordModel } from "../models/ChangePasswordModel";

export const login = async (data: LogInModel) => await axios.post(`${AZURE_SERVICE_API}/signIn`, data, CORS_CONFIG);
export const logout = async () => await axios.post(`${AZURE_SERVICE_API}/logout`, null, CORS_CONFIG);
export const changePassword = async (pswdData: ChangePasswordModel) => await axios.patch(`${AZURE_SERVICE_API}/users/password`, pswdData, CORS_CONFIG);