export type LogInModel = {
    username: string;
    password: string;
}

export type LogInResponseModel = {
    username: string,
    location: string,
    roleId: number
}