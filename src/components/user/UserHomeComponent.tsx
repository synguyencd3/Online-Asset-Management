import { faCheck, faXmark, faRotateBack } from '@fortawesome/free-solid-svg-icons';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import { AssignmentForTableModel } from '../../models/AssignmentForTable';
import { AssignmentHomeViewModel, AssignmentModel } from '../../models/AssignmentModel';
import { FunctionalIconModel } from '../../models/FunctionalIconModel';
import { OwnPageableModel } from '../../models/PageableModel';
import { responseAssignment, getOwnAssignmentDetails } from '../../services/AssignmentService';
import { ColorPalette } from '../../utils/ColorPalette';
import { AssignmentRequestState, AssignmentState } from '../../utils/Enum';
import { AssignmentModelComponent } from '../admin/assignment/AssignmentModalComponent';
import { PasswordModalComponent } from '../auth/PasswordModalComponent';
import { ConfirmModalComponent } from '../commons/ConfirmModalComponent';
import { LoaderComponent } from '../commons/LoaderComponent';
import { PaginationComponent } from '../commons/PaginationComponent';
import { TableComponent } from '../commons/TableComponent';
import { toDateString } from '../../utils/utils';

type Props = {
    setHeaderTitle: any
}

const header = [
    { name: 'Asset Code', value: "assetCode", sort: true, direction: true, colStyle: {} },
    { name: 'Asset Name', value: "assetName", sort: true, direction: true, colStyle: {} },
    { name: 'Category', value: "category", sort: true, direction: true, colStyle: {} },
    { name: 'Assigned Date', value: "assignedDate", sort: true, direction: true, colStyle: {} },
    { name: 'State', value: "state", sort: true, direction: true, colStyle: {} },
    { name: '', value: "", sort: true, direction: true, colStyle: {} },
]
const showModalCell = ["assetCode", "assetName", "category", "assignedDate", "state"];
const modalHeader = ["Asset Code", "Asset Name", "Category", "Specification", "Assigned to", "Assigned by", "Assigned Date", "State", "Note"];

export const UserHomeComponent: React.FC<Props> = (props: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [modalDetailShow, setModalDetailShow] = useState(false);
    const [firstLogin, setFirstLogin] = useState<boolean>(false);
    const [modalData, setModalData] = useState<AssignmentForTableModel>();
    const [data, setData] = useState<AssignmentHomeViewModel[]>([]);
    const [auxData, setAuxData] = useState<AssignmentModel[]>([]);
    const [auxHeader] = useState<string[]>(modalHeader);
    const [disableButton, setDisableButton] = useState<boolean[][]>([])
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for the Logout Modal
    const [responseData, setResponseData] = useState<{ id: number, status: string }>({ id: 0, status: '' });
    const [dummy, setDummy] = useState(1);


    const [param, setParam] = useState({
        search: "",
        states: ["ASSIGNED", "AVAILABLE", "NOT_AVAILABLE"],
        page: 0,
        size: 20,
        sort: "assetcode,asc",
    });

    const acceptAssignment = (...data: AssignmentModel[]) => {
        setShowConfirmModal(true);
        setResponseData({ id: data[1].id, status: AssignmentRequestState[AssignmentRequestState.ACCEPTED] });
    }
    const declineAssignment = (...data: AssignmentModel[]) => {
        setShowConfirmModal(true);
        setResponseData({ id: data[1].id, status: AssignmentRequestState[AssignmentRequestState.DECLINED] });
    }
    const returnAsset = () => {
        window.alert("Return Asset");
    }

    const acceptIcon: FunctionalIconModel = {
        icon: faCheck,
        style: { color: ColorPalette.PRIMARY_COLOR },
        onClickfunction: acceptAssignment
    };
    const declineIcon: FunctionalIconModel = {
        icon: faXmark,
        style: { color: 'black' },
        onClickfunction: declineAssignment
    };
    const returnIcon: FunctionalIconModel = {
        icon: faRotateBack,
        style: { color: 'blue', rotate: '70deg' },
        onClickfunction: returnAsset
    };
    const buttons: FunctionalIconModel[] = [acceptIcon, declineIcon, returnIcon];

    useEffect(() => {
        props.setHeaderTitle('Home');
        const isLoggedInFirst = sessionStorage.getItem('isFirstLogin') ? sessionStorage.getItem('isFirstLogin') : 'true';
        if (isLoggedInFirst === 'true') {
            setShowModal(false);
            setFirstLogin(false);
        } else {
            setShowModal(true);
        }
        getAssignmentData();
    }, []);

    useEffect(() => {
        getAssignmentData();
    }, [page, dummy]);

    const responseOwnAssignment = async (id: number, status: string) => {
        messageApi.open({
            type: 'loading',
            content: status == 'ACCEPTED' ? 'Accepting assignment...' : 'Declining assignment...',
        })
            .then(async () => {
                await responseAssignment(id, status)
                    .then((res: any) => {
                        if (res.status === 200) {
                            message.success(res.data.message);
                            getAssignmentData();
                        }
                    })
                    .catch((err) => {
                        message.error(err.response.data.message);
                    })
            })
    }

    const getAssignmentData = async () => {
        setLoading(true)

        const pageable: OwnPageableModel = {
            page: param.page,
            size: param.size,
            sort: param.sort
        }
        await getOwnAssignmentDetails(pageable)
            .then((res: any) => {
                if (res.status === 200) {
                    setAuxData(res.data.data.content)
                    setData(res.data.data.content.map((data: AssignmentHomeViewModel) => ({
                        assetCode: data.assetCode,
                        assetName: data.assetName,
                        category: data.category,
                        assignedDate: data.assignedDate,
                        state: AssignmentState[data.status as unknown as keyof typeof AssignmentState],
                    })));
                    const tableData: AssignmentHomeViewModel[] = [];
                    const disableBtns: boolean[][] = [];
                    res.data.data.content.map((data: AssignmentHomeViewModel) => {
                        tableData.push({
                            assetCode: data.assetCode,
                            assetName: data.assetName,
                            category: data.category,
                            assignedDate: toDateString(data.assignedDate),
                            status: AssignmentState[data.status as unknown as keyof typeof AssignmentState],
                        });
                        data.status.toString() === "WAITING_FOR_ACCEPTANCE" ? disableBtns.push([false, false, true]) : disableBtns.push([true, true, false]);

                    })
                    setData(tableData);
                    setDisableButton(disableBtns);
                    setTotalPage(res.data.data.totalPage)
                    setParam((p: any) => ({ ...p, page: res.data.data.currentPage }));
                    setLoading(false)
                }
            })
            .catch((err) => {
                message.error(err.response.message);
            });
    }

    const handleModalConfirm = () => {
        setShowConfirmModal(false);
        responseOwnAssignment(responseData.id, responseData.status); // Call the Confirm function
    }

    const handleModalCancel = () => {
        setShowConfirmModal(false); // Hide the Confirm Modal
    }

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div>
            {contextHolder}
            <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className='fw-bold fs-4 ms-1 mt-5 mb-3'>My Assignment</h4>
            
            {loading ?
                <LoaderComponent></LoaderComponent>
                :
                <>
                    {data.length === 0 ?
                        <Row>
                            <h5 className="text-center"> No Assignment Found</h5>
                        </Row> :
                        <>
                            <Row>
                                <TableComponent headers={header} datas={data} setSortString={setParam} auxData={auxData} auxHeader={auxHeader} buttons={buttons} showModalCell={showModalCell} setDummy={setDummy} setModalData={setModalData} setModalShow={setModalDetailShow} pre_button={undefined} disableButton={disableButton} />
                            </Row>
                            <PaginationComponent currentPage={param.page} totalPage={totalPage} setParamsFunction={setParam} setDummy={setPage} perPage={param.size} setPage={setPage} fixPageSize={false} />
                        </>
                    }
                </>
            }
            {modalData ? (
                <AssignmentModelComponent
                    title={"Detailed Assignment Information"}
                    show={modalDetailShow}
                    onHide={() => setModalDetailShow(false)}
                    data={modalData}
                />
            ) : (
                ""
            )}
            <PasswordModalComponent show={showModal} onClose={handleClose} isFirstLoggedIn={firstLogin} />
            <ConfirmModalComponent show={showConfirmModal} onConfirm={handleModalConfirm} onCancel={handleModalCancel} confirmTitle={'Are you sure?'} confirmQuestion={responseData.status == "ACCEPTED" ? 'Do you want to accept this assignment?' : 'Do you want to decline this assignment?'} confirmBtnLabel={responseData.status == 'ACCEPTED' ? 'Accept' : 'Decline'} cancelBtnLabel={'Cancel'} modalSize={'md'} />
        </div>
    );
};
