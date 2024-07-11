import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { AssetCreateModel, AssetEditRequestModel, AssetModel, AssetParamModel } from "../models/AssetModel";
import { PageResponseModel } from "../models/PageableModel";

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

export const getAssetUrl = (params: AssetParamModel) => { return AZURE_SERVICE_API + "/assets" + buildParam(params); };
export const getCategoryUrl = () => `${AZURE_SERVICE_API}/categories`;

export const getOneAssetHistoryUrl = (assetCode: string, page: string | number) => `${AZURE_SERVICE_API}/assets/history/${assetCode}?page=${page}`;

export const categoryFetcher = (url: string) => axios.get(url, CORS_CONFIG).then((response) => { ; return response; })

export const assetFetcher = async (url: string) => {

    const response = await axios.get(url, CORS_CONFIG)

    const data: PageResponseModel<AssetModel> = response.data.data;
    let assets: AssetModel[] = data.content;
    assets = assets.map(a => {
        return {
            assetCode: a.assetCode,
            name: a.name,
            category: a.category,
            installedDate: a.installedDate,
            state: a.state,
            location: a.location,
            specification: a.specification,
        }
    })
    return data;
}

function buildParam(param: AssetParamModel) {
    if (param.categories == undefined) return false;
    let params = "?"
        + "search=" + encodeURIComponent(param.search) + "&"
        + "states=" + param.states.join() + "&"
        + "categories=" + param.categories.join() + "&"
        + "page=" + param.page + "&"
        + "size=" + param.size + "&"
        + "sort=" + param.sort;
    return params;
}

