import { Container } from "react-bootstrap";

type Props = {

}
export const LoaderComponent = ({ }: Props) => {
    return (
        <Container className="d-flex justify-content-center mt-4">

            <div className="loader"></div>
        </Container>
    );
}