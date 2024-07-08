import React, { ReactNode, useEffect, useState } from 'react';
import { PasswordModalComponent } from '../../auth/PasswordModalComponent';
import { TableComponent } from '../../commons/TableComponent';
import { FunctionalIconModel } from '../../../models/FunctionalIconModel';
import { AssignmentHomeViewModel, AssignmentModel } from '../../../models/AssignmentModel';
import { faCheck, faRotateBack, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ColorPalette } from '../../../utils/ColorPalette';
import { getOwnAssignementSWR, responseAssignment } from '../../../services/AssignmentService';
import { AssignmentRequestState, AssignmentState } from '../../../utils/Enum';
import { PaginationComponent } from '../../commons/PaginationComponent';
import { Container, Row } from 'react-bootstrap';
import { LoaderComponent } from '../../commons/LoaderComponent';
import { message } from 'antd';
import { ConfirmModalComponent } from '../../commons/ConfirmModalComponent';
import { AssignmentModelComponent } from '../assignment/AssignmentModalComponent';
import { AssignmentForTableModel } from '../../../models/AssignmentForTable';
import { toDateString, uppercaseStatusToText } from '../../../utils/utils';
import { BreadcrumbComponent } from '../../commons/BreadcrumbComponent';
import useSWR from 'swr';
import { createReturningRequest } from '../../../services/ReturningService';

type Props = {
    setHeaderTitle: (title: ReactNode) => void
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

const RETURNING_STATE = "RETURNING";

type ConfirmModalType = {
    confirmTitle: string,
    confirmQuestion: string,
    confirmBtnLabel: string,
    cancelBtnLabel: string
}

const confirmModalData : {[key: string] : ConfirmModalType} = {
    "ACCEPTED": {
        confirmTitle: "Response Confirmation",
        confirmQuestion: 'Do you want to accept this assignment?',
        confirmBtnLabel: 'Accept',
        cancelBtnLabel: 'Cancel'
    },
    "DECLINED": {
        confirmTitle: "Response Confirmation",
        confirmQuestion: 'Do you want to decline this assignment?',
        confirmBtnLabel: 'Decline',
        cancelBtnLabel: 'Cancel'
    },
    "RETURNING": {
        confirmTitle: "Returning Confirmation",
        confirmQuestion: "Do you want to create a returning request for this asset?",
        confirmBtnLabel: 'Return',
        cancelBtnLabel: 'Cancel'
    },
}

export const AdminHomeComponent: React.FC<Props> = (props: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [modalDetailShow, setModalDetailShow] = useState(false);
    const [firstLogin, setFirstLogin] = useState<boolean>(false);
    const [modalData, setModalData] = useState<AssignmentForTableModel>();
    const [auxHeader] = useState<string[]>(modalHeader);
    const [messageApi, contextHolder] = message.useMessage();
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for the Logout Modal
    const [responseData, setResponseData] = useState<{ id: number, status: string }>({ id: 0, status: '' });
    const [param, setParam] = useState({
        search: "",
        states: ["ASSIGNED", "AVAILABLE", "NOT_AVAILABLE"],
        page: 0,
        size: 20,
        sort: "assetCode,asc",
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
        props.setHeaderTitle(<BreadcrumbComponent breadcrumb={[{
            title: 'Home',
            href: `${window.location.origin}/admin/home#`
        }]} />);
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
      <Container>
        {contextHolder}
        <h4
          style={{ color: ColorPalette.PRIMARY_COLOR }}
          className="fw-bold fs-4 ms-1 mt-5 mb-3"
        >
          My Assignment
        </h4>

        {isAssignmentLoading ? (
          <LoaderComponent />
        ) : (
          <>
            {assignmentResponse?.content.length === 0 ? (
              <Row>
                <h5 className="text-center"> No Assignment Found</h5>
              </Row>
            ) : (
              <>
                <Row className="ps-2">
                  <p className="fs-5" style={{ color: "gray" }}>
                    Total : {assignmentResponse?.content.length ?? 0}
                  </p>
                </Row>
                <Row>
                  <TableComponent
                    headers={header}
                    datas={formatRecordList(assignmentResponse?.content!)}
                    setSortString={setParam}
                    auxData={assignmentResponse?.content!}
                    auxHeader={auxHeader}
                    buttons={buttons}
                    showModalCell={showModalCell}
                    setDummy={() => {}}
                    setModalData={setModalData}
                    setModalShow={setModalDetailShow}
                    pre_button={undefined}
                    disableButton={setDisableButtonState(
                      assignmentResponse?.content!
                    )}
                  />
                </Row>
                <PaginationComponent
                  currentPage={param.page}
                  totalPage={assignmentResponse?.totalPage!}
                  setParamsFunction={setParam}
                  setDummy={() => {}}
                  perPage={param.size}
                  setPage={() => {
                    Math.random();
                  }}
                  fixPageSize={false}
                />
              </>
            )}
          </>
        )}
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
        <PasswordModalComponent
          show={showModal}
          onClose={handleClose}
          isFirstLoggedIn={firstLogin}
        />
        {confirmModalData[responseData.status] ? (
          <ConfirmModalComponent
            show={showConfirmModal}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
            confirmTitle={confirmModalData[responseData.status].confirmTitle}
            confirmQuestion={
              confirmModalData[responseData.status].confirmQuestion
            }
            confirmBtnLabel={
              confirmModalData[responseData.status].confirmBtnLabel
            }
            cancelBtnLabel={"Cancel"}
            modalSize={"md"}
          />
        ) : (
          ""
        )}
      </Container>
    );
};
