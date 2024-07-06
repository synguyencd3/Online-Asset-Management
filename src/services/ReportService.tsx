import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { PageableModel } from "../models/PageableModel";
import { ReportResponseModel } from "../models/ReportModel";

export const assetsEndpoint = `${AZURE_SERVICE_API}/assets`;

export const getReportView = async (params: PageableModel) => await axios.get(`${AZURE_SERVICE_API}/reports/view?page=${params.page}&size=${params.size}&sort=${params.sort}`, CORS_CONFIG);

export const getReportViewSWR = async (params: PageableModel) => {
    const response = await getReportView(params);
    const pageReport: ReportResponseModel = {
        content: response.data.data.content,
        totalElements: response.data.data.totalElements,
        totalPage: response.data.data.totalPage,
        currentPage: response.data.data.currentPage,
    }
    return pageReport;
}

export const exportReport = async (params: PageableModel) => await axios.get(`${AZURE_SERVICE_API}/reports/view?sort${params.sort}`, CORS_CONFIG);