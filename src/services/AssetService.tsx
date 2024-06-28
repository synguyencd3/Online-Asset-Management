import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { AssetCreateModel, AssetEditRequestModel } from "../models/AssetModel";

export const assetsEndpoint = `${AZURE_SERVICE_API}/assets`;

export const getAsset = async (params: string) => await axios.get(`${AZURE_SERVICE_API}/assets` + params, CORS_CONFIG);
export const getCategories = async () => await axios.get(`${AZURE_SERVICE_API}/categories`, CORS_CONFIG);

export const getOneAsset = async (assetCode: string) => await axios.get(`${AZURE_SERVICE_API}/assets/${assetCode}`, CORS_CONFIG);
export const getOneAssetHistory = async (assetCode: string, page: string | number) => await axios.get(`${AZURE_SERVICE_API}/assets/history/${assetCode}?page=${page}`, CORS_CONFIG);
export const getOneAssetHistoryOnly = async (assetCode: string, page: string | number) => await axios.get(`${AZURE_SERVICE_API}/assets/history/only/${assetCode}?page=${page}`, CORS_CONFIG);
export const deleteAsset = async (assetCode: string) => await axios.delete(`${AZURE_SERVICE_API}/assets/${assetCode}`, CORS_CONFIG);

export const createAsset = async (data: AssetCreateModel) => await axios.post(`${AZURE_SERVICE_API}/assets`, data, CORS_CONFIG);
export const updateAsset = async (assetCode: string, data: AssetEditRequestModel) => await axios.patch(`${AZURE_SERVICE_API}/assets/${assetCode}`, data, CORS_CONFIG);

export const getOneAssetUrl = (assetCode: string) => `${AZURE_SERVICE_API}/assets/${assetCode}`;

export const getOneAssetHistoryUrl = (assetCode: string, page: string | number) => `${AZURE_SERVICE_API}/assets/history/${assetCode}?page=${page}`;
export const getHistoryOnlyUrl = (assetCode: string, page: string | number) => `${AZURE_SERVICE_API}/assets/history/only/${assetCode}?page=${page}`;
