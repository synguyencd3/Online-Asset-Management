import { Roles } from "../utils/Enum"

export type UserForTableModel = {
    staffCode: string,
    fullname: string,
    username: string,
    joinedDate: string;
    type: Roles
}