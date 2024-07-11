import axios from "axios";
import { LogInModel } from "../models/LogInModel";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { ChangePasswordModel } from "../models/ChangePasswordModel";
import { message } from "antd";

export const login = async (data: LogInModel) => {
    message.loading({ content: 'Logging in...', key: 'login' });
    const response = await axios.post(`${AZURE_SERVICE_API}/auth/signIn`, data, CORS_CONFIG)
    message.destroy('login')
    return response
};
export const logout = async () => {
    message.loading({ content: 'Logging out...', key: 'logout' });
    const response = await axios.post(`${AZURE_SERVICE_API}/auth/logout`, null, CORS_CONFIG);
    message.destroy('logout')
    return response;
}
export const changePassword = async (pswdData: ChangePasswordModel) => {
    message.loading({ content: 'Changing Password...', key: 'changePassword' });
    await axios.patch(`${AZURE_SERVICE_API}/users/password`, pswdData, CORS_CONFIG);
    message.destroy('changePassword')
};