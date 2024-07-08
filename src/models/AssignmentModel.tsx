import { AssignmentState } from "../utils/Enum";

export type AssignmentResponse = {
    content: AssignmentHomeViewModel[],
    currentPage: number,
    totalPage: number,
    totalElements: number,
}

export type AssignmentModel = {
    id: number;
    assignmentCode: string;
    assetCode: string;
    assetName: string;
    assignedBy: string;
    assignedTo: string;
    assignedDate: Date;
    state: string;
    assignmentNote: string;
    assignmentState: any;
}

export type AssignmentHomeViewModel = {
    assetCode: string;
    assetName: string;
    category: string;
    assignedDate: string;
    status: AssignmentState;
}

export type AssignmentTableModel = {
    assetCode: string;
    assetName: string;
    category: string;
    assignedDate: string;
    note: string;
    state: AssignmentState;
    disableButton: boolean[];
}

export type AssignmentModalModel = {
    [key: string]: string | number; 
    id: number;
    assetCode: string,
    assetName: string,
    category: string,
    specification: string,
    assignedTo: string,
    assignedBy: string,
    assignedDate: string,
    status: string,
    note: string
}


export type AssignmentCreateModel = {
    staffCode: string,
    assetCode: string,
    assignedDate: string,
    note: string
}

export type AssignmentEditModel = {
    username: string,
    assetCode: string,
    note: string
}