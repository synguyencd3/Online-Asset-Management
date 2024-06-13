export enum AssignmentState {
    ACCEPTED = "Accepted",
    WAITING_ACCEPTANCE = "Waiting Acceptance",
    DECLINED = "Declined"
}

interface Assignment {
    id: number;
    assetCode: string;
    assetName: string;
    assignedTo: string;
    assignedBy: string;
    assignedDate: string;
    state: AssignmentState;
}

export const header = [
    { name: 'No.    ', sort: true },
    { name: 'Asset Code', sort: true },
    { name: 'Asset Name', sort: true },
    { name: 'Assigned To', sort: true },
    { name: 'Assigned By', sort: true },
    { name: 'Assigned Date', sort: true },
    { name: 'State', sort: true },
    { name: 'Actions', sort: false }
]

export const assignments: Array<Assignment> = [
    {
        id: 1,
        assetCode: 'AC123',
        assetName: 'Laptop',
        assignedTo: 'John Doe',
        assignedBy: 'Jane Smith',
        assignedDate: '2023-01-01',
        state: AssignmentState.ACCEPTED
    },
    {
        id: 2,
        assetCode: 'AC124',
        assetName: 'Monitor',
        assignedTo: 'Alice Brown',
        assignedBy: 'Bob Johnson',
        assignedDate: '2023-01-02',
        state: AssignmentState.WAITING_ACCEPTANCE
    },
    {
        id: 3,
        assetCode: 'AC125',
        assetName: 'Keyboard',
        assignedTo: 'Charlie Davis',
        assignedBy: 'Diana Green',
        assignedDate: '2023-01-03',
        state: AssignmentState.DECLINED
    },
    {
        id: 4,
        assetCode: 'AC126',
        assetName: 'Mouse',
        assignedTo: 'Eve White',
        assignedBy: 'Frank Black',
        assignedDate: '2023-01-04',
        state: AssignmentState.ACCEPTED
    },
    {
        id: 5,
        assetCode: 'AC127',
        assetName: 'Printer',
        assignedTo: 'George Harris',
        assignedBy: 'Helen Martin',
        assignedDate: '2023-01-05',
        state: AssignmentState.WAITING_ACCEPTANCE
    },
    {
        id: 6,
        assetCode: 'AC128',
        assetName: 'Desk',
        assignedTo: 'Ivy Clark',
        assignedBy: 'Jack Lewis',
        assignedDate: '2023-01-06',
        state: AssignmentState.DECLINED
    },
    {
        id: 7,
        assetCode: 'AC129',
        assetName: 'Chair',
        assignedTo: 'Karen Walker',
        assignedBy: 'Larry Hall',
        assignedDate: '2023-01-07',
        state: AssignmentState.ACCEPTED
    },
    {
        id: 8,
        assetCode: 'AC130',
        assetName: 'Tablet',
        assignedTo: 'Michael Young',
        assignedBy: 'Nancy King',
        assignedDate: '2023-01-08',
        state: AssignmentState.WAITING_ACCEPTANCE
    },
    {
        id: 9,
        assetCode: 'AC131',
        assetName: 'Phone',
        assignedTo: 'Olivia Scott',
        assignedBy: 'Paul Turner',
        assignedDate: '2023-01-09',
        state: AssignmentState.DECLINED
    },
    {
        id: 10,
        assetCode: 'AC132',
        assetName: 'Projector',
        assignedTo: 'Quincy Adams',
        assignedBy: 'Rachel Lee',
        assignedDate: '2023-01-10',
        state: AssignmentState.ACCEPTED
    }
];