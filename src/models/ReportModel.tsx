export type ReportModel = {
    category: string,
    total: number,
    assigned: number,
    available: number,
    notAvailable: number,
    waitingForRecycling: number,
    recycled: number
}

export type ReportResponseModel = {
    content: ReportModel[],
    currentPage: number,
    totalPage: number,
    totalElements: number,
}