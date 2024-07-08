import { ReturningState } from "../utils/Enum"

export type ReturingReponseModel = {
    content: ReturningModel[],
    currentPage: number,
    totalPage: number,
    totalElements: number,
}

export type ReturningModel = {
    id: number,
    assetCode: string,
    assetName: string,
    requestedBy: string,
    assignedDate: string,
    acceptedBy: string,
    returnedDate: string,
    state: ReturningState
}