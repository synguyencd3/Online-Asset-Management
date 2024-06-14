import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container, Modal } from "react-bootstrap";

type Props = {
    title: string;
    show: boolean;
    onHide: () => void;
    data: object;
}
export const InfoModal = (props: Props) => {

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header >
                <Container>

                    <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-around" style={{color:"red", fontWeight:"bold"}}>
                        {props.title ?? "Title"}
                    <Button variant="outline-danger" className="p-2" onClick={props.onHide}>
                        <FontAwesomeIcon size="lg" icon={faXmark}></FontAwesomeIcon>
                    </Button>
                    </Modal.Title>
                </Container>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}