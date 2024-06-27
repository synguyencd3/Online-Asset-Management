import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Modal, Row } from "react-bootstrap";

type Props = {
    title: string;
    show: boolean;
    onHide: () => void;
    // query: string;
    data: Object
    label: Object[];
}
export const DetailModalComponent = (props: Props) => {
    return (
        <Modal
            {...props}
            // size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ border: "2px solid black" }}
        >
            <Modal.Header >
                <Container>
                    <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-around align-items-center" style={{ color: "red", fontWeight: "bold" }}>
                            {props.title ?? "Title"}
                        <FontAwesomeIcon icon={faXmark} id="close-modal-button" className="px-1" onClick={props.onHide} style={{ border: "3px red solid", borderRadius: "5px" }}></FontAwesomeIcon>
                    </Modal.Title>
                </Container>
            </Modal.Header>
            <Modal.Body>
                <Container style={{ maxWidth: "80%" }}>
                    <Row>
                        <Col sm={4}>
                            {props.label ? Object.values(props.label).map((value: any, index:number) => (
                                <Row className="my-3 modal-field" key={value} id={"modal-label" + index}>
                                    {value.toString() ?? ""}
                                </Row>
                            )) : ""}
                        </Col>
                        <Col style={{overflow:"auto"}}>
                            {props.data ? Object.values(props.data).map((value: any) => (
                                <Row className="my-3 modal-value" key={value}>
                                    {value.toString() ?? ""}
                                </Row>
                            )) : ""}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}