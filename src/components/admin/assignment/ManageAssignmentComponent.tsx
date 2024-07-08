import React, { ReactNode, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { DropdownFilterComponent } from "../../commons/DropdownFilterComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { AssignmentState } from "../../../utils/Enum";
import { LoaderComponent } from "../../commons/LoaderComponent";
import { TableComponent } from "../../commons/TableComponent";
import { PaginationComponent } from "../../commons/PaginationComponent";
import { FunctionalIconModel } from "../../../models/FunctionalIconModel";
import { faPencil, faRotateBack } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";
import { ConfirmModalComponent } from "../../commons/ConfirmModalComponent";
import { AssignmentForTableModel } from "../../../models/AssignmentForTable";
import {
  AssignmentGetParams,
  deleteAssignmentById,
  getAssignments,
  getAssignmentsUrl,
} from "../../../services/AssignmentService";
import useSWR from "swr";
import { PageResponseModel } from "../../../models/PageableModel";
import { message } from "antd";
import { AssignmentModelComponent } from "./AssignmentModalComponent";
import { toDateString, uppercaseStatusToText } from "../../../utils/utils";
import { BreadcrumbComponent } from "../../commons/BreadcrumbComponent";
import { SearchComponent } from "../../commons/SearchComponent";
import { DatePickerComponent } from "../../commons/DatePickerComponent";
import { ColorPalette } from "../../../utils/ColorPalette";
import { createReturningRequest } from "../../../services/ReturningService";

const header = [
  {
    name: "No.",
    value: "id",
    sort: true,
    direction: true,
    colStyle: { width: "5%" },
  },
  {
    name: "Asset Code",
    value: "assetCode",
    sort: true,
    direction: true,
    colStyle: { width: "12%" },
  },
  {
    name: "Asset Name",
    value: "assetName",
    sort: true,
    direction: true,
    colStyle: { width: "20%" },
  },
  {
    name: "Assigned To",
    value: "assignedTo",
    sort: true,
    direction: true,
    colStyle: { width: "12%" },
  },
  {
    name: "Assigned By",
    value: "assignedBy",
    sort: true,
    direction: true,
    colStyle: { width: "12%" },
  },
  {
    name: "Assigned Date",
    value: "assignedDate",
    sort: true,
    direction: true,
    colStyle: { width: "12%" },
  },
  {
    name: "State",
    value: "status",
    sort: true,
    direction: true,
    colStyle: { width: "17%" },
  },
];
const showModalCell = ["assetCode", "assetName"];
const modalHeader: string[] = [];

const filterData = [
  {
    label: "Accepted",
    value: AssignmentState.ACCEPTED.toString(),
    defaultChecked: true,
  },
  {
    label: "Declined",
    value: AssignmentState.DECLINED.toString(),
    defaultChecked: true,
  },
  {
    label: "Waiting for acceptance",
    value: AssignmentState.WAITING_FOR_ACCEPTANCE.toString(),
    defaultChecked: true,
  },
  {
    label: "Waiting for returning",
    value: AssignmentState.WAITING_FOR_RETURNING.toString(),
    defaultChecked: true,
  },
];
type Props = {
  setHeaderTitle: (title: ReactNode) => void;
};

interface ConfirmModalData {
  onConfirm: () => void;
  onCancel: () => void;
  confirmTitle: string;
  confirmQuestion: string;
  confirmBtnLabel: string;
  cancelBtnLabel: string;
}

export const ManageAssignmentComponent: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    props.setHeaderTitle(
      <BreadcrumbComponent
        breadcrumb={[
          {
            title: "Manage Assignment",
            href: `${window.location.origin}/admin/manage-assignments#`,
          },
        ]}
      />
    );
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const newAssignment = location.state?.newAssignment;

  const [messageApi, contextHolder] = message.useMessage();
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState<AssignmentForTableModel>();
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<ConfirmModalData>();

  const [param, setParam] = useState<AssignmentGetParams>({
    search: "",
    status: [
      AssignmentState.ACCEPTED,
      AssignmentState.DECLINED,
      AssignmentState.WAITING_FOR_ACCEPTANCE,
      AssignmentState.WAITING_FOR_RETURNING,
    ],
    assignedDate: "",
    page: 0,
    size: 20,
    sort: "assetCode,asc",
  });

  const {
    data: assignmentResponse,
    isLoading: isAssignmentLoading,
    error: assignmentError,
    mutate: mutateAssignment,
  } = useSWR<PageResponseModel<AssignmentForTableModel>>(
    getAssignmentsUrl(param),
    getAssignments,
    {
      revalidateOnFocus: false,
    }
  );

  const handleSetParam = (
    func: (p: AssignmentGetParams) => AssignmentGetParams
  ) => {
    const newParam = func(param);
    if (newParam.page === param.page) {
      newParam.page = 0;
    }
    setParam(newParam);
    if (newAssignment) {
      navigate(location.pathname, { state: { newAssignment: undefined } });
    }
  };

  const handleDatePicker = (_: any, dateString: string | string[]) => {
    const formattedDateString = Array.isArray(dateString)
      ? dateString[0]
      : dateString;
    return handleSetParam((p: AssignmentGetParams) => ({
      ...p,
      assignedDate: formattedDateString,
    }));
  };

  const handleDeleteConfirm = async (assignmentId: number) => {
    setShowDisableModal(false);
    messageApi
      .open({
        type: "loading",
        content: "Deleting assignment...",
      })
      .then(async () => {
        await deleteAssignmentById(assignmentId)
          .then((response) => {
            message.success(response.data.message);
            if (newAssignment) {
              navigate(location.pathname, {
                state: { newAssignment: undefined },
              });
            }
            mutateAssignment();
          })
          .catch((error) => {
            message.error(error.response.data.message);
          });
      });
  };

  const handleCreateReturningRequest = async (assignmentId: number) => {
    setShowDisableModal(false);
    messageApi
      .open({
        type: "loading",
        content: "Creating returning request...",
      })
      .then(async () => {
        await createReturningRequest(assignmentId)
          .then((response) => {
            message.success(response.data.message);
            if (newAssignment) {
              navigate(location.pathname, {
                state: { newAssignment: undefined },
              });
            }
            mutateAssignment();
          })
          .catch((error) => {
            message.error(error.response.data.message);
          });
      });
  };

  const handleDeleteCancel = () => {
    setShowDisableModal(false);
  };

  function editAssignment(...data: AssignmentForTableModel[]) {
    navigate("/admin/manage-assignments/edit", { state: { user: data[1].id } });
  }

  function deleteAssignment(...data: AssignmentForTableModel[]) {
    setShowDisableModal(true);
    setConfirmModalData({
      onConfirm: () => handleDeleteConfirm(data[1].id),
      onCancel: handleDeleteCancel,
      confirmTitle: "Delete Confirmation",
      confirmQuestion: "Do you want to delete this assignment?",
      confirmBtnLabel: "Delete",
      cancelBtnLabel: "Cancel",
    });
  }

  function returnAsset(...data: AssignmentForTableModel[]) {
    setShowDisableModal(true);
    setConfirmModalData({
      onConfirm: () => handleCreateReturningRequest(data[1].id),
      onCancel: handleDeleteCancel,
      confirmTitle: "Returning Confirmation",
      confirmQuestion:
        "Do you want to create a returning request for this asset?",
      confirmBtnLabel: "Return",
      cancelBtnLabel: "Cancel",
    });
  }

  const buttons: FunctionalIconModel[] = [];

  const editIcon: FunctionalIconModel = {
    icon: faPencil,
    style: "",
    onClickfunction: editAssignment,
  };
  const deleteIcon: FunctionalIconModel = {
    icon: faCircleXmark,
    style: { color: "red" },
    onClickfunction: deleteAssignment,
  };

  const refreshIcon: FunctionalIconModel = {
    icon: faRotateBack,
    style: { color: "blue", rotate: "70deg" },
    onClickfunction: returnAsset,
  };

  const formatRecordList = (records: AssignmentForTableModel[]) => {
    return records.map((record: AssignmentForTableModel) => {
      return {
        id: record.id,
        assetCode: record.assetCode,
        assetName: record.assetName,
        assignedTo: record.assignedTo,
        assignedBy: record.assignedBy,
        assignedDate: toDateString(record.assignedDate),
        status: uppercaseStatusToText(record.status),
      };
    });
  };

  const setDisableButtonState = (data: AssignmentForTableModel[]) => {
    const isEqualState = (state: string, stateEnum: AssignmentState) =>
      uppercaseStatusToText(state).toLowerCase() === stateEnum.toLowerCase();
    return data.map((item: AssignmentForTableModel) => [
      !isEqualState(item.status, AssignmentState.WAITING_FOR_ACCEPTANCE),
      isEqualState(item.status, AssignmentState.ACCEPTED) || isEqualState(item.status, AssignmentState.WAITING_FOR_RETURNING),
      !isEqualState(item.status, AssignmentState.ACCEPTED),
    ]);
  };

  buttons.push(editIcon, deleteIcon, refreshIcon);

  if (assignmentError) {
    message.error(assignmentError.message);
    return <LoaderComponent></LoaderComponent>;
  }

  let assignmentList: AssignmentForTableModel[] = [];
  if (assignmentResponse) {
    assignmentList = assignmentResponse.content;
    if (newAssignment) {
      const newAssignmentRecord: AssignmentForTableModel = {
        id: newAssignment.id,
        assetCode: newAssignment.assetCode,
        assetName: newAssignment.assetName,
        assignedBy: newAssignment.assignBy,
        assignedTo: newAssignment.assignTo,
        assignedDate: newAssignment.assignedDate,
        status: newAssignment.status,
      };

      const assignments = assignmentList.filter(
        (item: AssignmentForTableModel) => item.id !== newAssignmentRecord.id
      );
      assignmentList = [newAssignmentRecord, ...assignments];
      if (assignmentList.length > param.size) {
        assignmentList.pop();
      }
    }
  }

  return (
    <Container>
      {contextHolder}
      <h4
        style={{ color: ColorPalette.PRIMARY_COLOR }}
        className="fw-bold fs-4 ms-1 mt-5 mb-3"
      >
        Assignment List
      </h4>
      <Row className="py-4 ms-0 pe-2 user-param-row justify-content-between">
        <Col sm={5}>
          <Row>
            <Col className="d-flex justify-content-start align-items-center px-2">
              <DropdownFilterComponent
                title={"State"}
                data={filterData}
                params={param.status}
                setParamsFunction={handleSetParam}
                setDummy={() => {}}
                style={{ width: "100%" }}
                defaultAll={true}
                paramName={"status"}
              ></DropdownFilterComponent>
            </Col>
            <Col className="d-flex justify-content-start align-items-center px-2">
              <DatePickerComponent
                handleDatePicker={handleDatePicker}
                placeHolderText={"Assigned Date"}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={5}>
          <Row>
            <Col sm={7}>
              <SearchComponent
                placeholder={""}
                setParamsFunction={handleSetParam}
                style={{ width: "100%" }}
                setDummy={() => {}}
              />
            </Col>
            <Col sm={4}>
              <Button
                variant="danger"
                onClick={() => {
                  return navigate("./new");
                }}
                style={{ width: "230px" }}
              >
                Create new assignment
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {isAssignmentLoading || !assignmentResponse ? (
        <LoaderComponent></LoaderComponent>
      ) : (
        <>
          {assignmentList.length === 0 ? (
            <Row>
              <h4 className="text-center"> No Assignment Found</h4>
            </Row>
          ) : (
            <>
              <Row className="ps-2">
                <p className="fs-5" style={{ color: "gray" }}>
                  Total : {assignmentResponse.totalElements}
                </p>
              </Row>
              <Row>
                <TableComponent
                  headers={header}
                  datas={formatRecordList(assignmentList)}
                  auxData={assignmentList}
                  auxHeader={modalHeader}
                  buttons={buttons}
                  setSortString={handleSetParam}
                  showModalCell={showModalCell}
                  setDummy={() => {}}
                  setModalData={setModalData}
                  setModalShow={setModalShow}
                  pre_button={undefined}
                  disableButton={setDisableButtonState(assignmentList)}
                ></TableComponent>
              </Row>
              <PaginationComponent
                currentPage={param.page}
                setParamsFunction={handleSetParam}
                totalPage={assignmentResponse.totalPage}
                setDummy={() => {}}
                perPage={param.size}
                fixPageSize={false}
                setPage={() => {}}
              ></PaginationComponent>
            </>
          )}
        </>
      )}
      {modalData ? (
        <AssignmentModelComponent
          title={"Detailed Assignment Information"}
          show={modalShow}
          onHide={() => setModalShow(false)}
          data={modalData}
        />
      ) : (
        ""
      )}
      {confirmModalData ? (
        <ConfirmModalComponent
          show={showDisableModal}
          onConfirm={confirmModalData.onConfirm}
          onCancel={confirmModalData.onCancel}
          confirmTitle={confirmModalData.confirmTitle}
          confirmQuestion={confirmModalData.confirmQuestion}
          confirmBtnLabel={confirmModalData.confirmBtnLabel}
          cancelBtnLabel={confirmModalData.cancelBtnLabel}
          modalSize={"md"}
        />
      ) : (
        ""
      )}
    </Container>
  );
};
