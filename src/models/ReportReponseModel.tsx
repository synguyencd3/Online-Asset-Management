import { ReportModel } from "./ReportModel"

export type ReportResponseModel = {
    content: ReportModel[],
    currentPage: number,
    totalPage: number,
    totalElements: number,
}