import { AssignmentState } from "../utils/Enum";

export type AssignmentModel = {
    id: number;
    assignmentCode: string;
    assetCode: string;
    assetName: string;
    assignedBy: string;
    assignedTo: string;
    assignedDate: Date;
    assignmentState: AssignmentState;
    assignmentNote: string;
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
    state: AssignmentState;
    disableButton: boolean[];
}

export type AssignmentModalModel = {
    assetCode: string,
    assetName: string,
    category: string,
    specification: string,
    assignedTo: string,
    assignedBy: string,
    assignedDate: string,
    state: string,
    note: string
}
