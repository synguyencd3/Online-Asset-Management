import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { DropdownFilterComponent } from "../../commons/DropdownFilterComponent";
import { useNavigate } from "react-router-dom";
import { AssignmentState } from "../../../utils/Enum";
//import { LOCAL_SERVICE_API } from '../../../utils/Config'
import { LoaderComponent } from "../../commons/LoaderComponent";
import { TableComponent } from "../../commons/TableComponent";
import { PaginationComponent } from "../../commons/PaginationComponent";
import { FunctionalIconModel } from "../../../models/FunctionalIconModel";
import { faPencil, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";
import { ConfirmModalComponent } from "../../commons/ConfirmModalComponent";
import { AssignmentForTableModel } from "../../../models/AssignmentForTable";
import {
  AssignmentGetParams,
  getAssignments,
  getAssignmentsUrl,
} from "../../../services/AssignmentService";
import useSWR from "swr";
import { PageResponseModel } from "../../../models/PageableModel";
import { message } from "antd";
import { SearchOnEnterComponent } from "../../commons/SearchOnEnterComponent";
import { AssignmentModelComponent } from "./AssignmentModalComponent";

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
const modalHeader = [
  "Staff Code",
  "Full Name",
  "Username",
  "Date of Birth",
  "Gender",
  "Joined Date",
  "Type",
  "Location",
];

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
];

export const ManageAssignmentComponent: React.FC = () => {
  const [newAssignment] = useState<AssignmentForTableModel>();

  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);

  const [modalData, setModalData] = useState<AssignmentForTableModel>({});

  const [showDisableModal, setShowDisableModal] = useState(false);

  const [param, setParam] = useState<AssignmentGetParams>({
    search: "",
    status: [
      AssignmentState.ACCEPTED,
      AssignmentState.DECLINED,
      AssignmentState.WAITING_FOR_ACCEPTANCE,
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
  } = useSWR<PageResponseModel<AssignmentForTableModel>>(
    getAssignmentsUrl(param),
    getAssignments
  );

  const handleDeleteConfirm = () => {};

  const handleDeleteCancel = () => {};

  function editAssignment(...data: AssignmentForTableModel[]) {
    navigate("/admin/manage-assignments/edit", { state: { user: data[1] } });
  }

  function deleteAssignment(...data: AssignmentForTableModel[]) {
    setShowDisableModal(false);
    window.alert(data);
  }

  function refreshAssignment(...data: AssignmentForTableModel[]) {
    window.alert(data);
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
    icon: faRefresh,
    style: "",
    onClickfunction: refreshAssignment,
  };

  buttons.push(editIcon, deleteIcon, refreshIcon);

  if (assignmentError) {
    message.error(assignmentError.message);
    return <LoaderComponent></LoaderComponent>;
  }

  return (
    <Container style={{ maxWidth: "100%" }} className="p-4">
      <h4 className="ms-1" style={{ color: "red", fontWeight: "bold" }}>
        Assignment List
      </h4>
      <Row className="py-4 ms-0 pe-2 user-param-row">
        <Col sm={5}>
          <Row>
            <Col className="d-flex justify-content-start align-items-center px-2">
              <DropdownFilterComponent
                title={"State"}
                data={filterData}
                params={param.status}
                setParamsFunction={setParam}
                setDummy={() => {}}
                style={{ width: "100%" }}
                defaultAll={false}
                paramName={"status"}
              ></DropdownFilterComponent>
            </Col>
            <Col className="d-flex justify-content-start align-items-center px-2">
              <Form.Control
                type="date"
                placeholder="Assigned Date"
                onChange={(e) =>
                  setParam((p: AssignmentGetParams) => ({
                    ...p,
                    assignedDate: e.target.value,
                  }))
                }
              />
            </Col>
          </Row>
        </Col>
        <Col sm={1}></Col>
        <Col sm={3} className="d-flex justify-content-end align-items-center">
          <SearchOnEnterComponent
            placeholder={""}
            setParamsFunction={setParam}
            style={{ width: "100%" }}
          ></SearchOnEnterComponent>
        </Col>
        <Col
          sm={3}
          className="d-flex justify-content-end align-items-center"
          //   style={{ maxWidth: "230px" }}
        >
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

      {isAssignmentLoading ? (
        <LoaderComponent></LoaderComponent>
      ) : (
        <>
          {assignmentResponse?.content.length === 0 ? (
            <Row>
              <h4 className="text-center"> No Assignment Found</h4>
            </Row>
          ) : (
            <>
              <Row>
                <TableComponent
                  headers={header}
                  datas={assignmentResponse?.content || []}
                  auxData={assignmentResponse?.content || []}
                  auxHeader={modalHeader}
                  buttons={buttons}
                  setSortString={setParam}
                  showModalCell={showModalCell}
                  setDummy={() => {}}
                  setModalData={setModalData}
                  setModalShow={setModalShow}
                  pre_button={undefined}
                  disableButton={[[false], [false]]}
                ></TableComponent>
              </Row>
              <PaginationComponent
                currentPage={param.page}
                setParamsFunction={setParam}
                totalPage={assignmentResponse?.totalPage || 0}
                setDummy={() => {}}
                perPage={param.size}
                fixPageSize={false}
                setPage={() => {}}
              ></PaginationComponent>
            </>
          )}
        </>
      )}
      <AssignmentModelComponent
        title={"Detailed Assignment Information"}
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={modalData}
      />
      <ConfirmModalComponent
        show={showDisableModal}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmTitle={"Are you sure?"}
        confirmQuestion={"Do you want to delete this asset?"}
        confirmBtnLabel={"Delete"}
        cancelBtnLabel={"Cancel"}
        modalSize={"md"}
      />
    </Container>
  );
};
