export enum Location {
    HCM,
    HN,
    DN,
}

export enum Gender {
    BLANK,
    MALE,
    FEMALE,
}

export enum StaffState {
    ACTIVE,
    INACTIVE,
}
// should change to number ?
export enum AssignmentState {
    ACCEPTED = 'Accepted',
    WATING_FOR_ACCEPTANCE = 'Wating for Acceptance',
    DECLINED = 'Declined',
}

export enum ReturningState {
    COMPLETED,
    WATING_FOR_RETURNING,
}

export enum AssetState {
    AVAILABLE = "Available",
    NOT_AVAILABLE = "Not Available",
    ASSIGNED = "Assigned",
}

export enum Roles {
    ADMIN = 1, STAFF = 2
}