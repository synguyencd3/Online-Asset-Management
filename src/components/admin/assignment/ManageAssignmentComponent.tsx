import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { DropdownFilterComponent } from '../../commons/DropdownFilterComponent'
import { useNavigate } from 'react-router-dom';
import { SearchComponent } from '../../commons/SearchComponent'
import { AssignmentState } from '../../../utils/Enum'
import { LoaderComponent } from '../../commons/LoaderComponent'
import { TableComponent } from '../../commons/TableComponent'
import { PaginationComponent } from '../../commons/PaginationComponent'
import { FunctionalIconModel } from '../../../models/FunctionalIconModel'
import { faCircleXmark, faPencil, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { ConfirmModalComponent } from '../../commons/ConfirmModalComponent'
import { AssignmentForTableModel } from '../../../models/AssignmentForTable'
import { getAssignments } from '../../../services/AssignmentService'
import { message } from 'antd';

const header = [
    { name: 'No.', value: 'Number', sort: true, direction: true, colStyle: { width: "5%" } },
    { name: 'Asset Code', value: 'AssetCode', sort: true, direction: true, colStyle: { width: "12%" } },
    { name: 'Asset Name', value: 'AssetName', sort: true, direction: true, colStyle: { width: "20%" } },
    { name: 'Assigned To', value: 'AssignedTo', sort: true, direction: true, colStyle: { width: "12%" } },
    { name: 'Assigned By', value: 'AssignedBy', sort: true, direction: true, colStyle: { width: "12%" } },
    { name: 'Assigned Date', value: 'Assigned Date', sort: true, direction: true, colStyle: { width: "12%" } },
    { name: 'State', value: 'State', sort: true, direction: true, colStyle: { width: "17%" } }];
const showModalCell = ["staffCode", "username", "fullName"]
const modalHeader = ["Staff Code", "Full Name", "Username", "Date of Birth", "Gender", "Joined Date", "Type", "Location"]
type Props = {
    setHeaderTitle: any
}
export const ManageAssignmentComponent: React.FC<Props> = (props: Props) => {
    //   const [filterParam, setFilterParam] = useState([AssignmentState.ACCEPTED, AssignmentState.DECLINED, AssignmentState.WATING_FOR_ACCEPTANCE]);

    //   const [searchParam, setSearchParam] = useState("");

    //   const [loading, setLoading] = useState(false);

    const [tableAsset, setTableAsset] = useState<AssignmentForTableModel[]>([]);

    const [newAssignment] = useState<AssignmentForTableModel>();

    const [_dummy, setDummy] = useState(1);

    const [loading, setLoading] = useState(false);

    const [totalPage, setTotalPage] = useState(0);

    const navigate = useNavigate();

    const [_modalShow, setModalShow] = useState(false);

    const [_modalData, setModalData] = useState<Object>({});

    const [showDisableModal, _setShowDisableModal] = useState(false);

    const [param, setParam] = useState({
        search: "",
        states: ["ACCEPTED", "DECLINED", "WAITING_FOR_ACCEPTANCE"],
        categories: [""],
        page: 0,
        size: 20,
        sort: "assetCode,asc",
    });

    useEffect(() => {
        props.setHeaderTitle("Manage Assignment");
    }, [])


    let filterData = [];
    let data1 = { label: "Accepted", value: AssignmentState.ACCEPTED.toString(), defaultChecked: true }
    let data2 = { label: "Declined", value: AssignmentState.DECLINED.toString(), defaultChecked: true }
    let data3 = { label: "Waiting for acceptance", value: AssignmentState.DECLINED.toString(), defaultChecked: true }
    filterData.push(data1, data2, data3);




    const buttons: FunctionalIconModel[] = [];

    const handleDeleteConfirm = () => {

    }

    const handleDeleteCancel = () => {

    }

    function editAssignment(...data: any[]) {
        navigate('/admin/manage-assignments/edit', { state: { user: data[1] } })
    }

    function deleteAssignment(...data: any[]) {
        window.alert(data)
    }

    function refreshAssignment(...data: any[]) {
        data;
    }

    const editIcon: FunctionalIconModel = {
        icon: faPencil,
        style: "",
        onClickfunction: editAssignment
    };
    const deleteIcon: FunctionalIconModel = {
        icon: faCircleXmark,
        style: { color: 'red' },
        onClickfunction: deleteAssignment
    };

    const refreshIcon: FunctionalIconModel = {
        icon: faRefresh,
        style: "",
        onClickfunction: refreshAssignment
    }

    async function InitializeQuery() {
        let params = "?"
        // + "search=" + encodeURIComponent(param.search) + "&"
        // + "states=" + param.states.join() + "&"
        // + "categories=" + param.categories.join() + "&"
        // + "page=" + param.page + "&"
        // + "size=" + "20" + "&"
        // + "sort=" + param.sort;

        console.log(params)
        setLoading(true)

        await getAssignments(params).then((response) => {
            const data = response.data.data;
            setParam((p: any) => ({ ...p, page: data.currentPage }));
            let assets: AssignmentForTableModel[] = data.content;
            assets.forEach(e => { e.state = e.state.charAt(0) + e.state.replace(/_/g, " ").slice(1).toLowerCase() })
            let assetTable: AssignmentForTableModel[] = [];
            if (newAssignment) {
                assetTable.push(newAssignment);
                newAssignment.state = newAssignment.state.charAt(0) + newAssignment.state.replace(/_/g, " ").slice(1).toLowerCase()
                assets.forEach(e => {
                    if (e.assetCode !== newAssignment.assetCode) {
                        assetTable.push(e);
                    }
                });
                setTableAsset(assetTable);
            }
            else {
                setTableAsset(data.content)
            }

            setTotalPage(data.totalPage);
        }).catch(e => {
            message.error(e.message);
        });
        setLoading(false);
        // window.history.replaceState({}, '')
    }


    useEffect(() => {
        //setTableAsset(DummyData)
        InitializeQuery()
    }, [])

    buttons.push(editIcon, deleteIcon, refreshIcon);
    return (
        <Container style={{ maxWidth: "100%" }} className="p-4">
            <Row className="py-4 me-3">
                <Col className="d-flex justify-content-start align-items-center px-0">
                    <DropdownFilterComponent title={"State"} data={filterData} params={param.states} setParamsFunction={setParam} setDummy={setDummy} style={{ width: "100%" }} defaultAll={false} paramName={'states'} ></DropdownFilterComponent>
                </Col>
                <Col className="d-flex justify-content-end align-items-center w-25 px-0">
                    <Form.Control type="date" />
                </Col>
                <Col sm={5} className="d-flex justify-content-end align-items-center ">
                    <SearchComponent placeholder={""} params={param.search} setParamsFunction={setParam} setDummy={setDummy} style={{ width: "100%" }}></SearchComponent>
                </Col>
                <Col className="d-flex justify-content-end align-items-center w-25"   >
                    <Button variant="danger" onClick={() => { return navigate('./new') }}>Create New Assignment</Button>
                </Col>
            </Row>

            {loading ?
                <LoaderComponent></LoaderComponent>
                :
                <>
                    {tableAsset.length === 0 ?
                        <Row>
                            <h4 className="text-center"> No Assignment Found</h4>
                        </Row> :
                        <>
                            <Row>

                                <TableComponent headers={header} datas={tableAsset} auxData={tableAsset} auxHeader={modalHeader} buttons={buttons} setSortString={setParam} showModalCell={showModalCell} setDummy={setDummy} setModalData={setModalData} setModalShow={setModalShow} pre_button={undefined} disableButton={[]}  ></TableComponent>
                            </Row>
                            <PaginationComponent currentPage={param.page} totalPage={totalPage} setDummy={setDummy} perPage={0} setParamsFunction={setParam} setPage={undefined} fixPageSize={false} ></PaginationComponent>
                        </>
                    }
                </>
            }
            {/* <UserInfoModalComponent
        title={"Detailed User Infomation"}
        show={modalShow}
        onHide={() => setModalShow(false)}
        label={modalHeader}
        data={modalData}
      /> */}
            <ConfirmModalComponent show={showDisableModal} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} confirmTitle={'Are you sure?'} confirmQuestion={'Do you want to delete this asset?'} confirmBtnLabel={'Delete'} cancelBtnLabel={'Cancel'} modalSize={"md"} />
        </Container>
    )
}
