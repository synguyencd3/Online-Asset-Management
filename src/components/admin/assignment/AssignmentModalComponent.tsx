import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Modal, Row } from "react-bootstrap";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { LoaderComponent } from "../../commons/LoaderComponent";
import {
  getOneAssignemnt,
  getOneAssignmentUrl,
} from "../../../services/AssignmentService";
import { AssignmentModalModel } from "../../../models/AssignmentModel";
import { AssignmentForTableModel } from "../../../models/AssignmentForTable";

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
  const [readMore, setReadMore] = useState<boolean[]>([]);

  useEffect(() => {}, [readMore]);
  const { data: assignment, isLoading } = useSWR<AssignmentModalModel>(
    props.data && props.data.id ? getOneAssignmentUrl(props.data.id) : null,
    getOneAssignemnt
  );

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
              onClick={props.onHide}
              style={{ border: "3px red solid", borderRadius: "5px" }}
            ></FontAwesomeIcon>
          </Modal.Title>
        </Container>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <LoaderComponent />
        ) : (
          <Container style={{ maxWidth: "95%" }}>
            {headers.map((header, index) => {
              if (assignment) {
                let value = assignment[header.value];
                const isLongerThan60 =
                  assignment[header.value].toString().length > 60;
                if (isLongerThan60 && readMore[index]) {
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
                          readMore[index] = !readMore[index];
                          setReadMore(() => [...readMore]);
                        }}
                        className="show-more"
                        style={{ color: "red" }}
                      >
                        {isLongerThan60
                          ? readMore[index]
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
