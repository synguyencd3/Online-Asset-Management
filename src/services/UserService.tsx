import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { UserModel, UserParamModel } from "../models/UserModel";
import { PageResponseModel } from "../models/PageableModel";
import { message } from "antd";

export const disableUser = async (staffCode: string) => await axios.delete(`${AZURE_SERVICE_API}/users/${staffCode}`, CORS_CONFIG);

export const getOneUser = async (staffCode: string) => await axios.get(`${AZURE_SERVICE_API}/users/${staffCode}`, CORS_CONFIG);

export const updateUser = async (staffCode: string, body: any) => await axios.put(`${AZURE_SERVICE_API}/users/` + staffCode, body, CORS_CONFIG);

export const createUser = async (body: any) => await axios.post(`${AZURE_SERVICE_API}/users`, body, CORS_CONFIG);

export const getUserUrl = (params: UserParamModel) => AZURE_SERVICE_API + "/users" + buildParam(params);

export const userFetcher = async (url: string) => {
    message.loading({ content: 'Loading Users...', key: 'loadingUsers' });
    const response = await axios.get(url, CORS_CONFIG)
    const data: PageResponseModel<UserModel> = response.data.data;
    message.destroy('loadingUsers')
    return data;
}

function buildParam(param: UserParamModel) {
    let params = "?"
        + "search=" + encodeURIComponent(param.search) + "&"
        + "types=" + encodeURIComponent(param.types.join()) + "&"
        + "page=" + encodeURIComponent(param.page) + "&"
        + "size=" + encodeURIComponent(param.size) + "&"
        + "self=" + encodeURIComponent(param.self) + "&"
        + "sort=" + encodeURIComponent(param.sort);
    return params;
}