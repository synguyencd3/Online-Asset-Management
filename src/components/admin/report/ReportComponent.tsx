import { message } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { ColorPalette } from '../../../utils/ColorPalette';
import { LoaderComponent } from '../../commons/LoaderComponent';
import { PaginationComponent } from '../../commons/PaginationComponent';
import { TableComponent } from '../../commons/TableComponent';
import { ReportModel } from '../../../models/ReportModel';
import * as XLSX from 'xlsx';
import { exportReport, getReportViewSWR } from '../../../services/ReportService';
import { PageableModel } from '../../../models/PageableModel';
import useSWR from 'swr';
import { BreadcrumbComponent } from '../../commons/BreadcrumbComponent';

type Props = {
    setHeaderTitle: (title: ReactNode) => void;
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
    const [auxHeader] = useState<string[]>(modalHeader);
    const [messageApi, contextHolder] = message.useMessage();
    const [param, setParam] = useState<PageableModel>({
        page: 0,
        size: 20,
        sort: "category,asc",
    });

    useEffect(() => {
        props.setHeaderTitle(<BreadcrumbComponent breadcrumb={[
            {
                title: 'Report',
                href: `${window.location.origin}/admin/reports#`
            }
        ]} />);
    }, []);

    const {
        data: reportResponse,
        isLoading: isReportLoading
    } = useSWR("report/view/"
        + param.page.toString()
        + param.size.toString()
        + param.sort.toString(),
        () => { return getReportViewSWR(param) },
        {
            onError: ((err) => message.error(err.response.data.message))
        }
    )

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
            {contextHolder}
            <Row className=' mt-5 mb-3 align-items-center justify-content-between'>
                <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className='fw-bold fs-4 ms-1'>Report</h4>
            </Row>
            <Row className='align-items-center justify-content-between my-3'>
                <Col sm={2} className='mx-1'>
                    <p className='fs-5 my-auto' style={{ color: "gray" }}>
                        Total : {reportResponse?.totalElements ?? 0}
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
                                <TableComponent headers={header} setSortString={setParam} datas={reportResponse?.content as ReportModel[]} auxData={reportResponse?.content as ReportModel[]} auxHeader={auxHeader} buttons={[]} showModalCell={[]} setDummy={() => { }} setModalData={() => { }} setModalShow={() => { }} pre_button={undefined} disableButton={[]} />
                            </Row>
                            <PaginationComponent currentPage={param.page} totalPage={reportResponse?.totalPage!} setParamsFunction={setParam} setDummy={() => { }} perPage={param.size} setPage={() => { }} fixPageSize={false} />
                        </>
                    }
                </>
            }
        </div>
    )
}
