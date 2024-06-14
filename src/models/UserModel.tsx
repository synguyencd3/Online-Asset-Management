import { AssignmentState } from "../utils/Enum";


export type Assignment = {
    id: number;
    assetCode: string;
    assetName: string;
    assignedTo: string;
    assignedBy: string;
    assignedDate: string;
    state: AssignmentState;
}