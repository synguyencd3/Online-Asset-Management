import { message } from "antd";
import { FormEvent, useState } from "react";
import { Col, Container, Form, OverlayTrigger, Pagination, Popover, Row } from "react-bootstrap";

type Props = {
    currentPage: number;
    totalPage: number;
    perPage: number
    setParamsFunction: any;
    fixPageSize: boolean
}
export const PaginationComponent = ({ currentPage, totalPage, setParamsFunction, perPage, fixPageSize }: Props) => {
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPage - 1;
    const [customPage, setCustomPage] = useState(currentPage + 1);
    const handlePageChange = (page: number) => {
        if (page === currentPage) {
            return
        }
        setParamsFunction((p: any) => ({ ...p, page: page }))
    };

    function handlePerPageChange(e: string) {
        if (Number.parseInt(e) <= 0) {
            message.warning("Please choose another value")
            return
        }
        setParamsFunction((p: any) => ({ ...p, size: e }))
    }
    function handleCustomPageSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // redundant
        if (customPage > totalPage || customPage <= 0) {
            message.warning("Please choose another value")
            return
        }
        handlePageChange(customPage - 1);
    }

    const popover = (
        <Popover id="popover-basic" style={{ maxWidth: "150px" }} >
            <Popover.Header style={{ textAlign: "center" }}>Choose Page</Popover.Header>
            <Popover.Body>
                <Form onSubmit={(e) => handleCustomPageSubmit(e)}>
                    <Form.Control type="number" min={1} max={totalPage} onChange={(e) => { setCustomPage(Number.parseInt(e.target.value)); }}></Form.Control>
                </Form>
            </Popover.Body>
        </Popover>
    );

    const renderPageItems = () => {
        const items = [];
        if (totalPage <= 5) {
            for (let i = 0; i < totalPage; i++) {
                items.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}> {i + 1} </Pagination.Item>
                );
            }
        }
        else {
            if (currentPage < 3) {
                for (let i = 0; i < 5; i++) {
                    items.push(
                        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}> {i + 1} </Pagination.Item>
                    );
                }
                items.push(
                    <OverlayTrigger key={"rightEllipsisOverlay"} trigger="click" placement="top" overlay={popover}>
                        <Pagination.Ellipsis key="rightEllipsis" />
                    </OverlayTrigger>
                )
            }
            else if (totalPage - currentPage < 5) {
                items.push(
                    <OverlayTrigger key={"leftEllipsisOverlay"} trigger="click" placement="top" overlay={popover}>
                        <Pagination.Ellipsis key="leftEllipsis" />
                    </OverlayTrigger>

                )
                for (let i = totalPage - 5; i < totalPage; i++) {
                    items.push(
                        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}> {i + 1} </Pagination.Item>
                    );
                }
            }
            else {
                items.push(
                    <OverlayTrigger key={"leftEllipsisOverlay"} delay={{ show: 100, hide: 0 }} trigger="click" placement="top" overlay={popover} rootClose={true}>
                        <Pagination.Ellipsis key="leftEllipsis" id="leftEllipsis" />
                    </OverlayTrigger>
                )
                for (let i = currentPage - 2; i < currentPage + 3; i++) {
                    items.push(
                        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}> {i + 1} </Pagination.Item>
                    );
                }
                items.push(
                    <OverlayTrigger key={"rightEllipsisOverlay"} delay={{ show: 100, hide: 0 }} trigger="click" placement="top" overlay={popover} rootClose={true}>
                        <Pagination.Ellipsis key="rightEllipsis" id="rightEllipsis" />
                    </OverlayTrigger>
                )
            }
        }
        return items;
    };

    return (
        <Container>
            <Row className="justify-content-end gy-4 py-4">
                <Col sm={2} style={{ width: "fit-content" }}>
                    {fixPageSize ? "" :
                        <div className="me-5" style={{ maxWidth: "100%", minWidth: "50px", width: "fit-content", textAlign: "left" }}>
                            <Form.Group as={Row} className="" controlId="location">
                                <Form.Select name="location" defaultValue={perPage} style={{ width: "100%" }} onChange={(e) => { handlePerPageChange(e.target.value) }}>
                                    <option value="10" >10 / page</option>
                                    <option value="20" >20 / page</option>
                                    <option value="50" >50 / page</option>
                                    <option value="100" >100 / page</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    }
                </Col>
                <Col sm={4} style={{ width: "fit-content" }}>
                    <Pagination className="justify-content-end">

                        <Pagination.Prev disabled={isFirstPage || totalPage === 0} onClick={() => handlePageChange(currentPage - 1)}> Previous</Pagination.Prev>

                        {renderPageItems()}

                        <Pagination.Next disabled={isLastPage || totalPage === 0} onClick={() => handlePageChange(currentPage + 1)}> Next</Pagination.Next >
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
}
