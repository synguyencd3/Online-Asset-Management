import { Roles } from "../utils/Enum"

export type UserForTableModel = {
    staffCode: string,
    fullName: string,
    username: string,
    joinedDate: string;
    type: Roles
}