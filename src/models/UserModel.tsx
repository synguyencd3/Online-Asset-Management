import { Roles } from "../utils/Enum";


export type UserModel = {
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