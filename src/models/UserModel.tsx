import { Roles } from "../utils/Enum";

export type UserModel = {
    [key: string]: any; // Add an index signature to support dynamic property access
    id: number;
    roleId: Roles;
    staffCode: string;
    firstName: string;
    lastName: string;
    username: string;
    gender: string;
    location: string;
    joinedDate: string;
    dateOfBirth: string;
    isChangePassword: boolean;
    status: string;
}

export type UserParamModel = {
    search: string,
    sort: string,
    types: string[],
    page: number,
    size: number
}

export type UserForTableModel = {
    [key: string]: any; // Add an index signature to support dynamic property access
    staffCode: string,
    fullName: string,
    username: string,
    joinedDate: string;
    type: string
}
export type ModalUserModel = {
    [key: string]: any; // Add an index signature to support dynamic property access
    staffCode: string;
    fullName: string;
    username: string;
    dateOfBirth: string;
    gender: string;
    joinedDate: string;
    roleId: string;
    location: string;
}
export interface CreateUserModel {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    joinedDate: Date;
    type: string;
    location: string;
}
export type UserForSelectTableModel = {
    staffCode: string,
    username?: string,
    fullName: string,
    type: string
}