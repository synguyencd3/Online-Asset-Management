// import { AssignmentModel } from "../../../models/AssignmentModel";
// import { AssignmentState } from "../../../utils/Enum";



// export const mockAssignments: AssignmentHomeViewModel[] = [
//     {
//         assetCode: 'ASSET001',
//         assetName: 'Laptop Dell XPS 13',
//         category: 'Electronics',
//         assignedDate: new Date('2023-01-15').toLocaleDateString(),
//         state: AssignmentState.ACCEPTED,
//     },
//     {
//         assetCode: 'ASSET002',
//         assetName: 'Office Chair',
//         category: 'Furniture',
//         assignedDate: new Date('2023-02-10').toLocaleDateString(),
//         state: AssignmentState.WAITING_FOR_ACCEPTANCE,
//     },
//     {
//         assetCode: 'ASSET003',
//         assetName: 'Monitor Samsung',
//         category: 'Electronics',
//         assignedDate: new Date('2023-03-05').toLocaleDateString(),
//         state: AssignmentState.DECLINED,
//     },
//     {
//         assetCode: 'ASSET004',
//         assetName: 'Keyboard Logitech',
//         category: 'Electronics',
//         assignedDate: new Date('2023-04-20').toLocaleDateString(),
//         state: AssignmentState.ACCEPTED,
//     },
//     {
//         assetCode: 'ASSET005',
//         assetName: 'Desk Lamp',
//         category: 'Furniture',
//         assignedDate: new Date('2023-05-30').toLocaleDateString(),
//         state: AssignmentState.WAITING_FOR_ACCEPTANCE,
//     },
//     {
//         assetCode: 'ASSET006',
//         assetName: 'Tablet iPad',
//         category: 'Electronics',
//         assignedDate: new Date('2023-06-15').toLocaleDateString(),
//         state: AssignmentState.DECLINED,
//     },
// ];

// export const disableButton = [
//     [true, true, false],
//     [true, true, false],
//     [false, false, true],
//     [false, false, true],
//     [true, true, false],
//     [false, false, true],
//     [false, false, true],
// ]

// export const header = [
//     { name: 'Asset Code', value: "assetCode", sort: true, direction: true, colStyle: {} },
//     { name: 'Asset Name', value: "assetName", sort: true, direction: true, colStyle: {} },
//     { name: 'Category', value: "category", sort: true, direction: true, colStyle: {} },
//     { name: 'Assigned Date', value: "assignedDate", sort: true, direction: true, colStyle: {} },
//     { name: 'State', value: "state", sort: true, direction: true, colStyle: {} },
//     { name: '', value: "", sort: true, direction: true, colStyle: {} },
// ]
// export const showModalCell = ["assetCode", "assetName", "category", "assignedDate", "state"];
// export const modalHeader = ["Asset Code", "Asset Name", "Category" ,"Specification", "Assigned to", "Assigned by", "Assigned Date", "State", "Note"];

// export const auxAssignmentData: AssignmentModel[] = [
//     {
//         id: 1,
//         assignmentCode: 'NET-SWITCH-REPL-FL3',
//         assetCode: 'SW-FL3-001',
//         assetName: 'Network Switch (Floor 3)',
//         assignedBy: 'IT Manager (Sarah Lee)',
//         assignedTo: 'Network Technician Team',
//         assignedDate: new Date('2024-06-28'),
//         assignmentState: AssignmentState.WAITING_FOR_ACCEPTANCE,
//         assignmentNote: 'Replace faulty network switch on Floor 3 to ensure stable network connectivity.'
//     },
//     {
//         id: 2,
//         assignmentCode: 'SEC-AUD-SRV',
//         assetCode: 'N/A', // Can be left blank if applicable to all servers
//         assetName: 'Server Infrastructure',
//         assignedBy: 'Security Department',
//         assignedTo: 'Security Analyst (David Kim)',
//         assignedDate: new Date('2024-06-26'),
//         assignmentState: AssignmentState.ACCEPTED,
//         assignmentNote: 'Perform a comprehensive security audit of the server infrastructure to identify and address potential vulnerabilities.'
//     },
//     {
//         id: 3,
//         assignmentCode: 'SW-UPDATE-DESIGN',
//         assetCode: 'N/A', // Can be left blank if not applicable
//         assetName: 'Design Software',
//         assignedBy: 'IT Department',
//         assignedTo: 'Software Support Team',
//         assignedDate: new Date('2024-07-02'),
//         assignmentState: AssignmentState.WAITING_FOR_ACCEPTANCE,
//         assignmentNote: 'Update Design Software to the latest version for improved functionality and security features.'
//     },
//     {
//         id: 4,
//         assignmentCode: 'MTRM-BOOK-SALES',
//         assetCode: 'MTRM-001',
//         assetName: 'Executive Meeting Room',
//         assignedBy: 'Sales Team Lead (Alice Brown)',
//         assignedTo: 'N/A', // Can be left blank if internal booking
//         assignedDate: new Date('2024-07-05'),
//         assignmentState: AssignmentState.ACCEPTED,
//         assignmentNote: 'Meeting with potential client. Requires booking of Executive Meeting Room from 2:00 PM to 4:00 PM.'
//     },
//     {
//         id: 5,
//         assignmentCode: 'PRINTER-CART-REPL-MKTG',
//         assetCode: 'PRINTER-MKTG-002',
//         assetName: 'Marketing Department Printer',
//         assignedBy: 'Marketing Department Staff',
//         assignedTo: 'Office Supplies Department',
//         assignedDate: new Date('2024-06-27'),
//         assignmentState: AssignmentState.WAITING_FOR_ACCEPTANCE,
//         assignmentNote: 'Marketing Department printer requires toner cartridge replacement.'
//     },
//     {
//         id: 6,
//         assignmentCode: 'ONBOARD-NEWEMP',
//         assetCode: 'N/A', // Can be left blank if not applicable
//         assetName: 'New Employee (Michael Jones)',
//         assignedBy: 'Human Resources Department',
//         assignedTo: 'HR Onboarding Specialist',
//         assignedDate: new Date('2024-07-09'),
//         assignmentState: AssignmentState.ACCEPTED,
//         assignmentNote: 'Complete onboarding process for new employee Michael Jones.'
//     },
//     {
//         id: 7,
//         assignmentCode: 'WEB-MAINT-COMP',
//         assetCode: 'N/A', // Can be left blank if not applicable
//         assetName: 'Company Website',
//         assignedBy: 'Marketing Department',
//         assignedTo: 'Web Development Team',
//         assignedDate: new Date('2024-06-25'),
//         assignmentState: AssignmentState.ACCEPTED,
//         assignmentNote: 'Perform routine maintenance on the company website, including content updates'
//     }

// ]
