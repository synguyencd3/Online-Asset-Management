// import { message } from 'antd';
import React, { useEffect } from 'react'
// import { Button, Row } from 'react-bootstrap';
// import { AssignmentModel } from '../../../models/AssignmentModel';
// import { ColorPalette } from '../../../utils/ColorPalette';
// import { LoaderComponent } from '../../commons/LoaderComponent';
// import { PaginationComponent } from '../../commons/PaginationComponent';
// import { TableComponent } from '../../commons/TableComponent';
// import { reports } from './MockData';
// import { ReportModel } from '../../../models/ReportModel';
// import * as XLSX from 'xlsx';

type Props = {
  setHeaderTitle: (title: string) => void;
}

// const header = [
//   { name: 'Category', value: "category", sort: true, direction: true, colStyle: {} },
//   { name: 'Total', value: "total", sort: true, direction: true, colStyle: {} },
//   { name: 'Assigned', value: "assigned", sort: true, direction: true, colStyle: {} },
//   { name: 'Available', value: "available", sort: true, direction: true, colStyle: {} },
//   { name: 'Not Vailable', value: "notAvailable", sort: true, direction: true, colStyle: {} },
//   { name: 'Waiting for recycling', value: "waitingForRecycling", sort: true, direction: true, colStyle: {} },
//   { name: 'Recycled', value: "recycled", sort: true, direction: true, colStyle: {} }
// ]
// const modalHeader = ["Category", "Total", "Assigned", "Available", "Not Vailable", "Assigned by", "Waiting for recycling", "Recycled"];

export const ReportComponent: React.FC<Props> = (props: Props) => {
  // const [data, setData] = useState<ReportModel[]>(reports);
  // const [totalElements, setTotalElements] = useState<number>(reports.length);
  // const [auxData, setAuxData] = useState<AssignmentModel[]>([]);
  // const [auxHeader] = useState<string[]>(modalHeader);
  // const [page, setPage] = useState(0);
  // const [totalPage, setTotalPage] = useState(0);
  // const [loading, setLoading] = useState(false);
  // const [messageApi, contextHolder] = message.useMessage();
  // const [dummy, setDummy] = useState(1);
  // const [param, setParam] = useState({
  //   search: "",
  //   states: ["ASSIGNED", "AVAILABLE", "NOT_AVAILABLE"],
  //   page: 0,
  //   size: 20,
  //   sort: "category,asc",
  // });

  useEffect(() => {
    props.setHeaderTitle("Reports");
  }, []);

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

  // // Step 2: Convert the data to a worksheet
  // const convertToWorksheet = (data: any[]): XLSX.WorkSheet => {
  //   return XLSX.utils.json_to_sheet(data);
  // };

  // // Step 3: Create and download the XLSX file
  // const downloadXLSX = (data: any[], filename: string = 'report_data.xlsx') => {
  //   const worksheet = convertToWorksheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  //   XLSX.writeFile(workbook, filename);
  // };

  // return (
  //   <div>
  //     <div>
  //       {contextHolder}
  //       <Row className=' mt-5 mb-3 align-items-center justify-content-between'>
  //         <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className='fw-bold fs-4 ms-1'>My Assignment</h4>
  //       </Row>
  //       <div className='d-flex align-items-center justify-content-end'>
  //         <Button
  //           onClick={() => { downloadXLSX(data) }}
  //           style={{ backgroundColor: ColorPalette.PRIMARY_COLOR }}
  //           disabled={totalElements < 1}
  //           className='px-4 border-0'
  //         >
  //           Export
  //         </Button>
  //       </div>
  //       {loading ?
  //         <LoaderComponent></LoaderComponent>
  //         :
  //         <>
  //           {data.length === 0 ?
  //             <Row>
  //               <h5 className="text-center"> No Category Found</h5>
  //             </Row> :
  //             <>
  //               <Row className='ps-2'>
  //                 <p className='fs-5' style={{ color: "gray" }}>
  //                   Total : {totalElements}
  //                 </p>
  //               </Row>
  //               <Row>
  //                 <TableComponent headers={header} setSortString={setParam} datas={data} auxData={auxData} auxHeader={auxHeader} buttons={[]} showModalCell={[]} setDummy={setDummy} setModalData={[]} setModalShow={[]} pre_button={undefined} disableButton={[]} />
  //               </Row>
  //               <PaginationComponent currentPage={param.page} totalPage={totalPage} setParamsFunction={setParam} setDummy={setPage} perPage={param.size} setPage={setPage} fixPageSize={false} />
  //             </>
  //           }
  //         </>
  //       }
  //     </div>
  //   </div>
  // )
  return <div></div>
}
