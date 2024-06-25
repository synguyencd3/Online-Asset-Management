import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";


export const getAsset = async (params: string) => await axios.get(`${AZURE_SERVICE_API}/assets` + params, CORS_CONFIG);
export const getCategories = async () => await axios.get(`${AZURE_SERVICE_API}/categories`, CORS_CONFIG);

export const getOneAsset = async (staffCode: string) => await axios.get(`${AZURE_SERVICE_API}/users/${staffCode}`, CORS_CONFIG);
