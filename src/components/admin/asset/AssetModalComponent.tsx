import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import { AssetHistoryModel, AssetModel } from "../../../models/AssetModel";
import useSWR from "swr";
import { getHistoryOnlyUrl } from "../../../services/AssetService";
import { useState } from "react";
import { getWithSWR } from "../../../services/swrService";
import { PaginationComponent } from "../../commons/PaginationComponent";
import { LoaderComponent } from "../../commons/LoaderComponent";

type Props = {
    title: string;
    show: boolean;
    onHide: () => void;
    data: AssetModel | undefined;
}
const headers = [
    { name: "Asset Code", value: "assetCode" },
    { name: "Asset Name", value: "name" },
    { name: "Category", value: "category" },
    { name: "Installed Date", value: "installedDate" },
    { name: "State", value: "state" },
    { name: "Location", value: "location" },
    { name: "Specification", value: "specification" },
]
const historyTableHeaders = [
    { name: "Date", value: "date" },
    { name: "Assigned To", value: "assignedTo" },
    { name: "Assigned By", value: "assignedBy" },
    { name: "Returned Date", value: "returnedDate" },

]
export const AssetModalComponent = (props: Props) => {

    const [currentPage, setCurrentPage] = useState({ page: 0, size: 10 });

    function setPage(_params: any) {

    }

    const [totalPage, setTotalPage] = useState(0);
    const [history, setHistory] = useState<AssetHistoryModel[]>([]);

    const { isLoading } = useSWR(props.data ? getHistoryOnlyUrl(props.data.assetCode, currentPage.page) : null, getWithSWR, {
        onSuccess: (response) => {
            const data = response.data.data;
            const historyT: AssetHistoryModel[] = data.content;
            const totalPageT = data.totalPages;
            setTotalPage(totalPageT);
            setHistory(historyT);
        }
    })

    return (
        <Modal
            {...props}
            dialogClassName="asset-detail-modal"
            centered
            backdrop={false}
        >
            <Modal.Header >
                <Container style={{ maxWidth: "90%" }}>
                    <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between align-items-center" style={{ color: "red", fontWeight: "bold" }}>
                        {props.title ?? "Title"}
                        <FontAwesomeIcon icon={faXmark} id="close-modal-button" className="px-1" onClick={props.onHide} style={{ border: "3px red solid", borderRadius: "5px" }}></FontAwesomeIcon>
                    </Modal.Title>
                </Container>
            </Modal.Header>
            <Modal.Body>
                <Container style={{ maxWidth: "95%" }}>
                    {headers.map((header, index) => (
                        <Row className="my-3 justify-content-between" key={header.name} id={"asset_modal_row_" + header.value + "_" + index}>
                            <Col sm={2} className="">
                                {header.name}
                            </Col>
                            <Col sm={10} style={{ maxHeight: "50px", overflowY: "auto" }}>
                                {props.data ? props.data[header.value] : ""}
                            </Col>
                        </Row>
                    ))}
                    <Row className="my-3 justify-content-between" id={"asset_modal_row_history"}>
                        <Col sm={2} className="">
                            History
                        </Col>
                        {isLoading ?
                            <LoaderComponent></LoaderComponent> :
                            <Col sm={10} style={{ maxHeight: "500px", height: history.length > 0 ? "460px" : "" }}>
                                <Table hover responsive className='table' id='table' style={{ minWidth: "auto" }}>
                                    <thead id='table-header'>
                                        <tr>
                                            {historyTableHeaders?.map((h) => (
                                                <th key={h.name}>
                                                    {h.name.length > 0 ?
                                                        <div className='header-border'>
                                                            {h.name}
                                                        </div>
                                                        : ""
                                                    }
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history ? history.map((h, idx) => (
                                            <tr key={"asset_history_table_row_" + idx} id={"asset_history_table_row_" + idx}>
                                                {historyTableHeaders.map((header, index) => (
                                                    <td key={"history_table_data" + idx + index} id={"history_table_data" + idx + index}>
                                                        <div className='cell'>
                                                            {h[header.value]}
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        )) : ""}
                                    </tbody>
                                </Table>
                            </Col>
                        }
                    </Row>
                    {isLoading ?
                        "" :
                        <PaginationComponent currentPage={currentPage.page} totalPage={totalPage} perPage={10} setParamsFunction={setCurrentPage} setDummy={setPage} setPage={setPage} fixPageSize={true}></PaginationComponent>
                    }
                </Container>
            </Modal.Body>
        </Modal>
    );
}