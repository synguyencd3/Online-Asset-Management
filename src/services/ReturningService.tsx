import axios from "axios";
import { RequestPageableModel } from "../models/PageableModel";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { ReturingReponseModel } from "../models/ReturningModel";
import { message } from "antd";

export interface ReturningGetParams {
    [key: string]: string | Array<string> | number;
    search: string;
    status: Array<string>;
    returnedDate: string;
    page: number;
    size: number;
    sort: string;
}

export const getRequestForReturning = (pageable: RequestPageableModel) => axios.get(`${AZURE_SERVICE_API}/return-request?search=${pageable.search}&state=${pageable.states}&returnedDate=${pageable.returnedDate}&page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`, CORS_CONFIG);

export const getRequestForReturningSWR = async (params: RequestPageableModel) => {
    message.loading({ content: 'Loading Return Requests...', key: 'loadingReturnRequests', duration: 0 });

    const response = await getRequestForReturning(params);
    const pageReturning: ReturingReponseModel = {
        content: response.data.data.content,
        totalElements: response.data.data.totalElements,
        totalPage: response.data.data.totalPage,
        currentPage: response.data.data.currentPage,
    };
    message.destroy("loadingReturnRequests");
    return pageReturning;
}

export const createReturningRequest = (assignmentId: number) => {
    message.loading({ content: 'Create Return Requests...', key: 'createReturningRequest', duration: 0 });
    const response = axios.post(`${AZURE_SERVICE_API}/return-request`, { assignmentId: assignmentId }, CORS_CONFIG);
    message.destroy("createReturningRequest");
    return response
}
const completeReturningRequest = (returningId: number) => axios.put(`${AZURE_SERVICE_API}/return-request/${returningId}`, {}, CORS_CONFIG);
const cancelReturningRequest = (returningId: number) => axios.delete(`${AZURE_SERVICE_API}/return-request/${returningId}`, CORS_CONFIG);

export const sendResponseReturningRequest = async (returningId: number, status: boolean) => {
    let response;
    if (status) {
        response = await completeReturningRequest(returningId)
    } else {
        response = await cancelReturningRequest(returningId)
    };
    return response;

};