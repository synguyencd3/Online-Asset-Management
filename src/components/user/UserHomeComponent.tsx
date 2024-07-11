import { faCheck, faXmark, faRotateBack } from '@fortawesome/free-solid-svg-icons';
import { message } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import { AssignmentForTableModel } from '../../models/AssignmentForTable';
import { AssignmentHomeViewModel, AssignmentModel } from '../../models/AssignmentModel';
import { FunctionalIconModel } from '../../models/FunctionalIconModel';
import { responseAssignment, getOwnAssignementSWR } from '../../services/AssignmentService';
import { ColorPalette } from '../../utils/ColorPalette';
import { AssignmentRequestState, AssignmentState } from '../../utils/Enum';
import { AssignmentModelComponent } from '../admin/assignment/AssignmentModalComponent';
import { PasswordModalComponent } from '../auth/PasswordModalComponent';
import { ConfirmModalComponent } from '../commons/ConfirmModalComponent';
import { LoaderComponent } from '../commons/LoaderComponent';
import { PaginationComponent } from '../commons/PaginationComponent';
import { TableComponent } from '../commons/TableComponent';
import { confirmModalData, toDateString, uppercaseStatusToText } from '../../utils/utils';
import { BreadcrumbComponent } from '../commons/BreadcrumbComponent';
import useSWR from 'swr';
import { TableHeaderModel } from '../../models/TableHeaderModel';
import { createReturningRequest } from '../../services/ReturningService';

type Props = {
    setHeaderTitle: (title: ReactNode) => void
}

const header: TableHeaderModel[] = [
    { name: 'Asset Code', value: "assetCode", sort: true, direction: true, colStyle: {}, isCurrentlySorted: true, style: {} },
    { name: 'Asset Name', value: "assetName", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: 'Category', value: "category", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: 'Assigned Date', value: "assignedDate", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: 'State', value: "state", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: '', value: "", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
]
const showModalCell = ["assetCode", "assetName", "category", "assignedDate", "state"];
const modalHeader = ["Asset Code", "Asset Name", "Category", "Specification", "Assigned to", "Assigned by", "Assigned Date", "State", "Note"];

const RETURNING_STATE = "RETURNING";



export const UserHomeComponent: React.FC<Props> = (props: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [modalDetailShow, setModalDetailShow] = useState(false);
    const [firstLogin, setFirstLogin] = useState<boolean>(false);
    const [modalData, setModalData] = useState<AssignmentForTableModel>();
    const [messageApi, contextHolder] = message.useMessage();
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for the Logout Modal
    const [responseData, setResponseData] = useState<{ id: number, status: string }>({ id: 0, status: '' });

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
    const returnAsset = (...data: AssignmentModel[]) => {
        setShowConfirmModal(true);
        setResponseData({ id: data[1].id, status: RETURNING_STATE });
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
        props.setHeaderTitle(<BreadcrumbComponent breadcrumb={[
            {
                title: 'Home',
                href: `${window.location.origin}/user/home#`
            }
        ]} />);
        const isLoggedInFirst = sessionStorage.getItem('isFirstLogin') ? sessionStorage.getItem('isFirstLogin') : 'true';
        if (isLoggedInFirst === 'true') {
            setShowModal(false);
            setFirstLogin(false);
        } else {
            setShowModal(true);
        }
    }, []);

    const setDisableButtonState = (data: AssignmentHomeViewModel[]) => {
        const isEqualState = (state: string, stateEnum: AssignmentState) =>
            uppercaseStatusToText(state).toLowerCase() === stateEnum.toLowerCase();
        return data.map((item: AssignmentHomeViewModel) => [
            !isEqualState(item.status, AssignmentState.WAITING_FOR_ACCEPTANCE),
            isEqualState(item.status, AssignmentState.ACCEPTED) || isEqualState(item.status, AssignmentState.WAITING_FOR_RETURNING),
            !isEqualState(item.status, AssignmentState.ACCEPTED),
        ]);
    };

    const formatRecordList = (records: AssignmentHomeViewModel[]) => {
        return records.map((record: AssignmentHomeViewModel) => {
            return {
                assetCode: record.assetCode,
                assetName: record.assetName,
                category: record.category,
                assignedDate: toDateString(record.assignedDate),
                status: uppercaseStatusToText(record.status),
            };
        });
    };

    const {
        data: assignmentResponse,
        isLoading: isAssignmentLoading,
        mutate: mutateAssignment
    } = useSWR("assignments/own/"
        + param.page.toString()
        + param.size.toString()
        + param.sort.toString(),
        () => { return getOwnAssignementSWR(param) },
        {
            onError: ((err) => message.error(err.response.data.message))
        }
    )

    const handleCreateReturningRequest = async (assignmentId: number) => {
        setShowConfirmModal(false);
        messageApi
          .open({
            type: "loading",
            content: "Creating returning request...",
          })
          .then(async () => {
            await createReturningRequest(assignmentId)
              .then((response) => {
                message.success(response.data.message);
                mutateAssignment();
              })
              .catch((error) => {
                message.error(error.response.data.message);
              });
          });
      };

    const responseOwnAssignment = async (id: number, status: string) => {
        if (status === RETURNING_STATE) {
            handleCreateReturningRequest(id);
            return;
        }
        messageApi.open({
            type: 'loading',
            content: status == 'ACCEPTED' ? 'Accepting assignment...' : 'Declining assignment...',
        })
            .then(async () => {
                await responseAssignment(id, status)
                    .then((res: any) => {
                        if (res.status === 200) {
                            message.success(res.data.message);
                            mutateAssignment();
                        }
                    })
                    .catch((err) => {
                        message.error(err.response.data.message);
                    })
            })
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

            {isAssignmentLoading ?
                <LoaderComponent></LoaderComponent>
                :
                <>
                    {assignmentResponse?.content.length === 0 ?
                        <Row>
                            <h5 className="text-center"> No Assignment Found</h5>
                        </Row> :
                        <>
                            <Row>
                                <TableComponent headers={header} datas={formatRecordList(assignmentResponse?.content!)} setSortString={setParam} auxData={assignmentResponse?.content!} auxHeader={modalHeader} buttons={buttons} showModalCell={showModalCell} setDummy={() => { }} setModalData={setModalData} setModalShow={setModalDetailShow} pre_button={undefined} disableButton={setDisableButtonState(assignmentResponse?.content!)} />
                            </Row>
                            <PaginationComponent currentPage={param.page} totalPage={assignmentResponse?.totalPage!} setParamsFunction={setParam} perPage={param.size} fixPageSize={false} containerRef={undefined} />
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
            {confirmModalData[responseData.status] ? 
                <ConfirmModalComponent show={showConfirmModal} onConfirm={handleModalConfirm} onCancel={handleModalCancel} confirmTitle={confirmModalData[responseData.status].confirmTitle} confirmQuestion={confirmModalData[responseData.status].confirmQuestion} confirmBtnLabel={confirmModalData[responseData.status].confirmBtnLabel} cancelBtnLabel={confirmModalData[responseData.status].cancelBtnLabel} modalSize={'md'} />
                : ''
            }
        </div>
    );
};
