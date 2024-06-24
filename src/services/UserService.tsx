import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";

export const disableUser = async (staffCode: string) => await axios.delete(`${AZURE_SERVICE_API}/users/${staffCode}`, CORS_CONFIG);

export const getUser = async (params: string) => await axios.get(`${AZURE_SERVICE_API}/users` + params, CORS_CONFIG);

export const getOneUser = async (staffCode: string) => await axios.get(`${AZURE_SERVICE_API}/users/${staffCode}`, CORS_CONFIG);

export const updateUser = async (staffCode: string, body: any) => await axios.put(`${AZURE_SERVICE_API}/users/` + staffCode, body, CORS_CONFIG);

export const createUser = async (body: any) => await axios.post(`${AZURE_SERVICE_API}/users/`, body, CORS_CONFIG);
