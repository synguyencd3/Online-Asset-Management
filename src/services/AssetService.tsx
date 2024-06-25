import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { AssetCreateModel } from "../models/AssetModel";


export const getAsset = async (params: string) => await axios.get(`${AZURE_SERVICE_API}/assets` + params, CORS_CONFIG);
export const getCategories = async () => await axios.get(`${AZURE_SERVICE_API}/categories`, CORS_CONFIG);

export const getOneAsset = async (staffCode: string) => await axios.get(`${AZURE_SERVICE_API}/users/${staffCode}`, CORS_CONFIG);

export const createAsset = async (data: AssetCreateModel) => await axios.post(`${AZURE_SERVICE_API}/assets`, data, CORS_CONFIG);