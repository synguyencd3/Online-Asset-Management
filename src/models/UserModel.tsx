import { Gender, Location, StaffState, StaffType, AssignmentState } from "../utils/Enum";

export type Assignment = {
    id: number;
    assetCode: string;
    assetName: string;
    assignedTo: string;
    assignedBy: string;
    assignedDate: string;
    state: AssignmentState;
}

export type UserModel = {
    id: number;
    staffCode: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    username: string;
    password: string;
    location: Location;
    gender: Gender;
    joinDate: Date;
    type: StaffType;
    state: StaffState;
}