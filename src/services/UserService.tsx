import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { UserModel, UserParamModel } from "../models/UserModel";
import { PageResponseModel } from "../models/PageableModel";

export const disableUser = async (staffCode: string) => await axios.delete(`${AZURE_SERVICE_API}/users/${staffCode}`, CORS_CONFIG);

export const getUser = async (params: string) => await axios.get(`${AZURE_SERVICE_API}/users` + params, CORS_CONFIG);

export const getOneUser = async (staffCode: string) => await axios.get(`${AZURE_SERVICE_API}/users/${staffCode}`, CORS_CONFIG);

export const updateUser = async (staffCode: string, body: any) => await axios.put(`${AZURE_SERVICE_API}/users/` + staffCode, body, CORS_CONFIG);

export const createUser = async (body: any) => await axios.post(`${AZURE_SERVICE_API}/users`, body, CORS_CONFIG);


export const getUserUrl = (params: UserParamModel) => AZURE_SERVICE_API + "/users" + buildParam(params);

export const userFetcher = async (url: string) => {

    const response = await axios.get(url, CORS_CONFIG)

    const data: PageResponseModel<UserModel> = response.data.data;

    return data;
}


function buildParam(param: UserParamModel) {
    let params = "?"
        + "search=" + encodeURIComponent(param.search) + "&"
        + "types=" + param.types.join() + "&"
        + "page=" + param.page + "&"
        + "size=" + param.size + "&"
        + "sort=" + param.sort;
    return params;
}