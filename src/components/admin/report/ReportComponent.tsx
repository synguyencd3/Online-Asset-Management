import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { ColorPalette } from '../../../utils/ColorPalette';
import { LoaderComponent } from '../../commons/LoaderComponent';
import { PaginationComponent } from '../../commons/PaginationComponent';
import { TableComponent } from '../../commons/TableComponent';
import { ReportModel, ReportResponseModel } from '../../../models/ReportModel';
import * as XLSX from 'xlsx';
import { exportReport, getReportView, getReportViewSWR } from '../../../services/ReportService';
import { PageableModel } from '../../../models/PageableModel';
import useSWR from 'swr';

type Props = {
    setHeaderTitle: (title: string) => void;
}

const header = [
    { name: 'Category', value: "category", sort: true, direction: true, colStyle: { width: '30%' } },
    { name: 'Total', value: "total", sort: true, direction: true, colStyle: { width: '10%' } },
    { name: 'Assigned', value: "assigned", sort: true, direction: true, colStyle: { width: '10%' } },
    { name: 'Available', value: "available", sort: true, direction: true, colStyle: { width: '10%' } },
    { name: 'Not Vailable', value: "notAvailable", sort: true, direction: true, colStyle: { width: '15%' } },
    { name: 'Waiting for recycling', value: "waitingForRecycling", sort: true, direction: true, colStyle: { width: '25%' } },
    { name: 'Recycled', value: "recycled", sort: true, direction: true, colStyle: { width: '10%' } }
]
const modalHeader = ["Category", "Total", "Assigned", "Available", "Not Vailable", "Waiting for recycling", "Recycled"];

export const ReportComponent: React.FC<Props> = (props: Props) => {
    const [data, setData] = useState<ReportModel[]>([]);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [auxData, setAuxData] = useState<ReportResponseModel[]>([]);
    const [auxHeader] = useState<string[]>(modalHeader);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();
    const [dummy, setDummy] = useState(1);
    const [param, setParam] = useState<PageableModel>({
        page: 0,
        size: 20,
        sort: "category,asc",
    });

    useEffect(() => {
        props.setHeaderTitle("Reports");
        // getReportViewData();
    }, []);

    useEffect(() => {
        // getReportViewData();
    }, [page, dummy]);

    const {
        data: reportResponse,
        isLoading: isReportLoading
    } = useSWR("report/view/"
        + param.page.toString()
        + param.size.toString()
        + param.sort.toString(),
        () => { return getReportViewSWR(param) },
        {
            onSuccess: ((res) => {
                setTotalElements(res.totalElements);
                setTotalPage(res.totalPage);
            }),
            onError: ((err) => message.error(err.response.data.message))
        }
    )

    console.log(reportResponse);

    // const getReportViewData = async () => {
    //     setLoading(true);
    //     await getReportView(param).then((res) => {
    //         if (res.status === 200) {
    //             console.log(res.data.data.content);
    //             setAuxData(res.data.data.content);
    //             setData(res.data.data.content.map((data: ReportModel) => ({
    //                 category: data.category,
    //                 total: data.total,
    //                 assigned: data.assigned,
    //                 available: data.available,
    //                 notAvailable: data.notAvailable,
    //                 waitingForRecycling: data.waitingForRecycling,
    //                 recycled: data.recycled
    //             })));
    //             setTotalElements(res.data.data.totalElements);
    //             setTotalPage(res.data.data.totalPage);
    //             setLoading(false);
    //         }
    //     }).catch((err) => message.error(err.response.data.message));
    // }

    // Step 2: Convert the data to a worksheet
    const convertToWorksheet = (data: any[]): XLSX.WorkSheet => {
        return XLSX.utils.json_to_sheet(data);
    };

    // Step 3: Create and download the XLSX file
    const downloadXLSX = (data: any[], filename: string = 'report_data.xlsx') => {
        const worksheet = convertToWorksheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, filename);
    };

    const exportReportViewData = async () => {
        messageApi.open({
            type: 'loading',
            content: 'Exporting data...',
        }).then(async () => {
            await exportReport().then((res) => {
                if (res.status === 200) {
                    downloadXLSX(res.data.data);
                }
            }).catch((err) => message.error(err.response.data.message));
        })
    }

    return (
        <div>
            <div>
                {contextHolder}
                <Row className=' mt-5 mb-3 align-items-center justify-content-between'>
                    <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className='fw-bold fs-4 ms-1'>My Assignment</h4>
                </Row>
                <Row className='align-items-center justify-content-between my-3'>
                    <Col sm={2} className='mx-1'>
                        <p className='fs-5 my-auto' style={{ color: "gray" }}>
                            Total : {reportResponse?.totalElements}
                        </p>
                    </Col>
                    <Col sm={2} className='d-flex justify-content-center'>
                        <Button
                            onClick={exportReportViewData}
                            style={{ backgroundColor: ColorPalette.PRIMARY_COLOR }}
                            disabled={reportResponse?.totalElements! < 1}
                            className='px-4 border-0 me-2'>
                            Export
                        </Button>
                    </Col>
                </Row>
                {isReportLoading ?
                    <LoaderComponent />
                    :
                    <>
                        {reportResponse?.content.length === 0 ?
                            <Row>
                                <h5 className="text-center"> No Report Found</h5>
                            </Row> :
                            <>
                                <Row>
                                    <TableComponent headers={header} setSortString={setParam} datas={reportResponse?.content as ReportModel[]} auxData={auxData} auxHeader={auxHeader} buttons={[]} showModalCell={[]} setDummy={() => {}} setModalData={() => {}} setModalShow={() => {}} pre_button={undefined} disableButton={[]}/>
                                </Row>
                                <PaginationComponent currentPage={param.page} totalPage={totalPage} setParamsFunction={setParam} setDummy={setPage} perPage={param.size} setPage={setPage} fixPageSize={false} />
                            </>
                        }
                    </>
                }
            </div>
        </div>
    )
}
