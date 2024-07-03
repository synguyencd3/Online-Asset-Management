import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Modal, Row } from "react-bootstrap";
import useSWR from "swr";
import { useState } from "react";
import { LoaderComponent } from "../../commons/LoaderComponent";
import {
  getOneAssignemnt,
  getOneAssignmentUrl,
} from "../../../services/AssignmentService";
import { AssignmentModalModel } from "../../../models/AssignmentModel";
import { AssignmentForTableModel } from "../../../models/AssignmentForTable";
import { message } from "antd";
import { toDateString, uppercaseStatusToText } from "../../../utils/utils";

type Props = {
  title: string;
  show: boolean;
  onHide: () => void;
  data: AssignmentForTableModel | undefined;
};

const headers = [
  { name: "Asset Code", value: "assetCode" },
  { name: "Asset Name", value: "assetName" },
  { name: "Specification", value: "specification" },
  { name: "Assigned to", value: "assignedTo" },
  { name: "Assigned by", value: "assignedBy" },
  { name: "Assigned Date", value: "assignedDate" },
  { name: "State", value: "status" },
  { name: "Note", value: "note" },
];

export const AssignmentModelComponent = (props: Props) => {
  const [isShowFull, setIsShowFull] = useState<boolean[]>([]);

  const {
    data: assignmentData,
    isLoading
  } = useSWR<AssignmentModalModel>(
    props.data && props.data.id ? getOneAssignmentUrl(props.data.id) : null,
    getOneAssignemnt,
    {
      onError: (error) => {
        message.error(error.response.data.message);
        props.onHide();
      },
    }
  );

  const formatData = (data: AssignmentModalModel): AssignmentModalModel => {
    const formattedData : AssignmentModalModel = { ...data };
    formattedData.assignedDate = toDateString(data.assignedDate);
    formattedData.status = uppercaseStatusToText(data.status);
    return formattedData;
  };

  const assignment: AssignmentModalModel | undefined = assignmentData
      ? formatData(assignmentData)
      : undefined;

  return (
    <Modal
      {...props}
      dialogClassName="assignment-detail-modal"
      centered
      backdrop={false}
    >
      <Modal.Header>
        <Container style={{ maxWidth: "90%" }}>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex justify-content-between align-items-center"
            style={{ color: "red", fontWeight: "bold" }}
          >
            {props.title ?? "Title"}
            <FontAwesomeIcon
              icon={faXmark}
              id="close-modal-button"
              className="px-1"
              onClick={() => {
                setIsShowFull([]);
                props.onHide();
              }}
              style={{ border: "3px red solid", borderRadius: "5px" }}
            ></FontAwesomeIcon>
          </Modal.Title>
        </Container>
      </Modal.Header>
      <Modal.Body>
        {isLoading || !assignment ? (
          <LoaderComponent />
        ) : (
          <Container style={{ maxWidth: "95%" }}>
            {headers.map((header, index) => {
              if (assignment) {
                let value = assignment[header.value];
                const isLongerThan60 =
                  assignment[header.value].toString().length > 60;
                if (isLongerThan60 && !isShowFull[index]) {
                  value = assignment[header.value].toString().substring(0, 60);
                }
                return (
                  <Row
                    className="my-3 justify-content-between"
                    key={header.name}
                    id={"assignment_model_row_" + header.value}
                  >
                    <Col sm={3} className="">
                      {header.name}
                    </Col>
                    <Col
                      sm={9}
                      id={"assignment_model_row_data_" + header.value}
                      style={{ overflow: "auto" }}
                    >
                      {value}
                      <span
                        id={"show_more_" + header.value}
                        onClick={() => {
                          isShowFull[index] = !isShowFull[index];
                          setIsShowFull(() => [...isShowFull]);
                        }}
                        className="show-more"
                        style={{ color: "red" }}
                      >
                        {isLongerThan60
                          ? !isShowFull[index]
                            ? " Show more"
                            : " Show less"
                          : ""}
                      </span>
                    </Col>
                  </Row>
                );
              }
            })}
          </Container>
        )}
      </Modal.Body>
    </Modal>
  );
};
