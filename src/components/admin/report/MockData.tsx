import { ReportModel, ReportResponseModel } from "../../../models/ReportModel";

export const reports: ReportModel[] = [
    {
        category: 'Bluetooth Mouse',
        total: 1000,
        assigned: 550,
        available: 450,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Headset',
        total: 1500,
        assigned: 1200,
        available: 298,
        notAvailable: 2,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Ipad',
        total: 500,
        assigned: 300,
        available: 200,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Iphone',
        total: 450,
        assigned: 400,
        available: 50,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Laptop',
        total: 1500,
        assigned: 1300,
        available: 200,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Mobile',
        total: 600,
        assigned: 300,
        available: 300,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Monitor',
        total: 1500,
        assigned: 1000,
        available: 500,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Personal Computer',
        total: 1500,
        assigned: 1300,
        available: 200,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Tablet',
        total: 400,
        assigned: 350,
        available: 50,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Printer',
        total: 200,
        assigned: 150,
        available: 50,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Keyboard',
        total: 300,
        assigned: 250,
        available: 50,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Scanner',
        total: 100,
        assigned: 80,
        available: 20,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Smartphone',
        total: 700,
        assigned: 500,
        available: 200,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    },
    {
        category: 'Webcam',
        total: 150,
        assigned: 120,
        available: 30,
        notAvailable: 0,
        waitingForRecycling: 0,
        recycled: 0
    }
];


export const reportResponse: ReportResponseModel = {
    content: reports,
    currentPage: 0,
    totalPage: 3,
    totalElements: 10
}