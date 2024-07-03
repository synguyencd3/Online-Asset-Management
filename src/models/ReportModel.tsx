export type ReportModel = {
    category: string,
    total: number,
    assigned: number,
    available: number,
    notAvailable: number,
    waitingForRecycling: number,
    recycled: number
}