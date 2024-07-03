import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { Button, Row } from 'react-bootstrap';
import { ColorPalette } from '../../../utils/ColorPalette';
import { LoaderComponent } from '../../commons/LoaderComponent';
import { PaginationComponent } from '../../commons/PaginationComponent';
import { TableComponent } from '../../commons/TableComponent';
import { ReportModel, ReportResponseModel } from '../../../models/ReportModel';
import * as XLSX from 'xlsx';
import { exportReport, getReportView } from '../../../services/ReportService';
import { PageableModel } from '../../../models/PageableModel';

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
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [dummy, setDummy] = useState(1);
    const [param, setParam] = useState<PageableModel>({
        page: 0,
        size: 20,
        sort: "category,asc",
    });

    useEffect(() => {
        props.setHeaderTitle("Reports");
        getReportViewData();
    }, []);

    useEffect(() => {
        getReportViewData();
    }, [page, dummy]);

    const getReportViewData = async () => {
        setLoading(true);
        await getReportView(param).then((res) => {
            if (res.status === 200) {
                setAuxData(res.data.data.content)
                setData(res.data.data.content.map((data: ReportModel) => ({
                    category: data.category,
                    total: data.total,
                    assigned: data.assigned,
                    available: data.available,
                    notAvailable: data.notAvailable,
                    waitingForRecycling: data.waitingForRecycling,
                    recycled: data.recycled
                })));
                setTotalElements(res.data.data.totalElements);
                setTotalPage(res.data.data.totalPage);
                setLoading(false);
            }
        }).catch((err) => message.error(err.response.data.message));
    }

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
                    setData(res.data.content);
                    setTotalElements(res.data.totalElements);
                    setTotalPage(res.data.totalPages);
                    setLoading(false);
                }
                downloadXLSX(data);

            }).catch((err) => message.error(err.response.data.message));
        })
    }

    // // Step 1: Convert the data to CSV format
    // const convertToCSV = (data: any[]): string => {
    //   const array = [Object.keys(data[0])].concat(data);

    //   return array.map(row => {
    //     return Object.values(row).map(value => `"${value}"`).join(',');
    //   }).join('\n');
    // };

    // // Step 2: Create and download the CSV file
    // const downloadCSV = (data: any[], filename: string = 'report.xlxs') => {
    //   const csv = convertToCSV(data);
    //   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    //   const link = document.createElement('a');

    //   if (link.download !== undefined) {
    //     const url = URL.createObjectURL(blob);
    //     link.setAttribute('href', url);
    //     link.setAttribute('download', filename);
    //     link.style.visibility = 'hidden';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //   }
    // };

    return (
        <div>
            <div>
                {contextHolder}
                <Row className=' mt-5 mb-3 align-items-center justify-content-between'>
                    <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className='fw-bold fs-4 ms-1'>My Assignment</h4>
                </Row>
                <div className='d-flex align-items-center justify-content-end'>
                    <Button
                        onClick={exportReportViewData}
                        style={{ backgroundColor: ColorPalette.PRIMARY_COLOR }}
                        disabled={totalElements < 1}
                        className='px-4 border-0'
                    >
                        Export
                    </Button>
                </div>
                {loading ?
                    <LoaderComponent></LoaderComponent>
                    :
                    <>
                        {data?.length === 0 ?
                            <Row>
                                <h5 className="text-center"> No Category Found</h5>
                            </Row> :
                            <>
                                <Row className='ps-2'>
                                    <p className='fs-5' style={{ color: "gray" }}>
                                        Total : {totalElements}
                                    </p>
                                </Row>
                                <Row>
                                    <TableComponent headers={header} setSortString={setParam} datas={data} auxData={auxData} auxHeader={auxHeader} buttons={[]} showModalCell={[]} setDummy={setDummy} setModalData={[]} setModalShow={[]} pre_button={undefined} disableButton={[]} />
                                </Row>
                                <PaginationComponent currentPage={param.page} totalPage={totalPage} setParamsFunction={setParam} setDummy={setPage} perPage={param.size} setPage={setPage} fixPageSize={false} />
                            </>
                        }
                    </>
                }
            </div>
        </div>
    )
    // return <div></div>
}
