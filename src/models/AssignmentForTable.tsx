// import { AssignmentState } from "../utils/Enum";

export type AssignmentForTableModel = {
    no: number;
    assetCode: string;
    assetName: string;
    assignedBy: string;
    assignedTo: string;
    assignedDate: Date;
    state: string;
}