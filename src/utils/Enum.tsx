export enum Location {
    HCM,
    HN,
    DN,
}
export enum Prfix {
    SD, BPS
}

export enum Gender {
    BLANK,
    MALE,
    FEMALE,
}
export enum GenderLowerCase {
    Male = "MALE",
    Female = "FEMALE",
}
export enum GenderUpperCase {
    MALE = "Male",
    FEMALE = "Female",
}

export enum StaffState {
    ACTIVE,
    INACTIVE,
}

// should change to number ?
export enum AssignmentState {
    ACCEPTED = 'Accepted',
    WAITING_FOR_ACCEPTANCE = 'Wating for Acceptance',
    DECLINED = 'Declined',
}

export enum ReturningState {
    COMPLETED,
    WAITING_FOR_RETURNING,
}

export enum AssetState {
    AVAILABLE = "Available",
    NOT_AVAILABLE = "Not available",
    ASSIGNED = "Assigned",
    WAITING_FOR_RECYCLING = "Waiting for recycling",
    RECYCLED = "Recycled"
}

export enum Roles {
    ADMIN = 1, STAFF = 2
}

export enum RolesLowerCase {
    Admin = 1, Staff = 2
}

export enum RolesAsString {
    ADMIN = "Admin", STAFF = "Staff"
}