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

export enum StaffType {
    ADMIN,
    STAFF,
}

export enum StaffState {
    ACTIVE,
    INACTIVE,
}

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
    AVAILABLE,
    NOT_AVAILABLE,
    ASSIGNED
}