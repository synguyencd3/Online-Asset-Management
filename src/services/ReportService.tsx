import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { PageableModel } from "../models/PageableModel";

export const assetsEndpoint = `${AZURE_SERVICE_API}/assets`;

export const getReportView = async (params: PageableModel) => await axios.get(`${AZURE_SERVICE_API}/reports/view?page=${params.page}&size=${params.size}&sort=${params.sort}`, CORS_CONFIG);
export const exportReport = async () => await axios.get(`${AZURE_SERVICE_API}/reports/export`, CORS_CONFIG);