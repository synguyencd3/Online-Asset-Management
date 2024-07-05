import axios from "axios";
import { PageableModel, RequestPageableModel } from "../models/PageableModel";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { ReturingReponseModel } from "../models/ReturningModel";

export interface ReturningGetParams {
    [key: string]: string | Array<string> | number;
    search: string;
    status: Array<string>;
    returnedDate: string;
    page: number;
    size: number;
    sort: string;
}

const toStringParams = (params: ReturningGetParams) => {
    params = {
        ...params,
        status: params.status.map((status) =>
            status.toUpperCase().replace(/ /g, "_")
        ),
    };
    return Object.keys(params)
        .map((key) => {
            let value = params[key];
            if (Array.isArray(params[key])) {
                value = (params[key] as string[]).join(",");
            }
            return `${key}=${value}`;
        })
        .join("&");
};

export const getRequestForReturning = (pageable: RequestPageableModel) => axios.get(`${AZURE_SERVICE_API}/return-request?search=${pageable.search}&state=${pageable.states}&page=${pageable.page}&size=${pageable.size}`, CORS_CONFIG);

export const getRequestForReturningSWR = async (params: RequestPageableModel) => {
    const response = await getRequestForReturning(params);
    const pageReturning: ReturingReponseModel = {
        content: response.data.data.content,
        totalElements: response.data.data.totalElements,
        totalPage: response.data.data.totalPage,
        currentPage: response.data.data.currentPage,
    };
    return pageReturning;
}