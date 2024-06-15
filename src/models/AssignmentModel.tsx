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
    asignmentNote: string;
}