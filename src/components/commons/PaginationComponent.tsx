import { message } from "antd";
import { Col, Container, Form, Pagination, Row } from "react-bootstrap";

type Props = {
    currentPage: number;
    totalPage: number;
    perPage: number
    setParamsFunction: any;
    setDummy: any;
    setPage: any;
    fixPageSize: boolean
}
export const PaginationComponent = ({ currentPage, totalPage, setParamsFunction, setDummy, perPage, setPage, fixPageSize }: Props) => {
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPage - 1;

    const handlePageChange = (page: number) => {
        if (page === currentPage) {
            return
        }
        setParamsFunction((p: any) => ({ ...p, page: page }))
        setPage(Math.random())
    };

    function handlePerPageChange(e: string) {
        if (Number.parseInt(e) <= 0) {
            message.warning("Please choose another value")
            return
        }
        setParamsFunction((p: any) => ({ ...p, size: e }))
        setDummy(Math.random())
    }

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
                    <Pagination.Ellipsis key="rightEllipsis" />
                )
            }
            else if (totalPage - currentPage < 5) {
                items.push(
                    <Pagination.Ellipsis key="leftEllipsis" />
                )
                for (let i = totalPage - 5; i < totalPage; i++) {
                    items.push(
                        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}> {i + 1} </Pagination.Item>
                    );
                }
            }
            else {
                items.push(
                    <Pagination.Ellipsis key="leftEllipsis" />
                )
                for (let i = currentPage - 2; i < currentPage + 3; i++) {
                    items.push(
                        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}> {i + 1} </Pagination.Item>
                    );
                }
                items.push(
                    <Pagination.Ellipsis key="rightEllipsis" />
                )
            }
        }
        return items;
    };

    return (
        <>
            <Container>
                <Row className="justify-content-end gy-4 py-4">
                    <Col sm={2} style={{ width: "fit-content" }}>
                        {fixPageSize ? "" :
                            <div className="me-5" style={{ maxWidth: "100%", minWidth: "50px", width: "fit-content", textAlign: "left" }}>
                                <Form.Group as={Row} className="" controlId="location">
                                    <Form.Select name="location" defaultValue={perPage} style={{ width: "100%" }} onChange={(e) => { handlePerPageChange(e.target.value) }}>
                                        <option value="1" >1 / page</option>
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
        </>
    );
}
