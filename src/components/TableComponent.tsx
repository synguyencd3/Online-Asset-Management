import { faArrowRotateLeft, faCheck, faFilter, faMagnifyingGlass, faPencil, faRectangleXmark, faRotate, faRotateBack, faRotateBackward, faSortDown, faSortUp, faUserPen, faXmark } from '@fortawesome/free-solid-svg-icons'
import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import { Button, Col, Container, Row, Table } from "react-bootstrap";

import { header as headers, assignments, AssignmentState } from "./MockData";

export const TableComponent = () => {

    const [header, setHeader] = useState(headers);
    return (
        <>
            <></>
            <Container style={{ maxWidth: "90%", width: "100%" }}>
                <Row>
                    <Col>
                        <Table striped bordered hover className='table'>
                            <thead>
                                <tr>
                                    {header?.map((h, index) => (
                                        <th key={h.name}>
                                            <div className='table-header'>
                                                {h.name}
                                                <FontAwesomeIcon values={h.name} icon={h.sort ? faSortDown : faSortUp} style={{ color: "#ff0000", }} onClick={(e) => { h.sort = !h.sort; header[index] = h; setHeader([...header]) }} />
                                            </div>
                                        </th>
                                    ))}
                                    <th className='last-cell'>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments?.map((a, index) => (
                                    <tr key={a.id}>
                                        <td>{a.id}</td>
                                        <td>{a.assetCode}</td>
                                        <td>{a.assetName}</td>
                                        <td>{a.assignedTo}</td>
                                        <td>{a.assignedBy}</td>
                                        <td>{a.assignedDate}</td>
                                        <td>{a.state}</td>
                                        <td className='last-cell'>
                                            <Container>
                                                <Row className='g-3'>
                                                    <Col lg={3}>
                                                        {/* <Button variant='outline-danger' className='' disabled = {a.state == AssignmentState.ACCEPTED}> */}
                                                            <FontAwesomeIcon size='lg' icon={faPencil} />
                                                        {/* </Button> */}
                                                    </Col>
                                                    <Col lg={3}>
                                                        {/* <Button variant='outline-danger'  disabled = {a.state == AssignmentState.ACCEPTED}> */}
                                                            <FontAwesomeIcon size='lg' style={{color:"red"}} icon={faCircleXmark} />
                                                        {/* </Button> */}
                                                    </Col>
                                                    <Col lg={3}>
                                                        {/* <Button variant='outline-danger'  disabled = {a.state == AssignmentState.ACCEPTED}> */}
                                                            <FontAwesomeIcon size='lg' style={{color:"blue"}} icon={faArrowRotateLeft} spin spinReverse />
                                                        {/* </Button> */}
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Container>
                            <Row className='g-3'>
                                <Col lg={3}>
                                    <Button variant='outline-danger' className=''>
                                        <FontAwesomeIcon size='lg' icon={faCheck} />
                                    </Button>
                                </Col>
                                <Col lg={3}>
                                    <Button variant='outline-danger'>
                                        <FontAwesomeIcon size='lg' icon={faUserPen} />
                                    </Button>
                                </Col>
                                <Col lg={3}>
                                    <Button variant='outline-danger'>
                                        <FontAwesomeIcon size='lg' icon={faCircleXmark} />
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                        <Container>
                            <Row className='g-3'>
                                <Col lg={3}>
                                    <Button variant='outline-danger' className=''>
                                        <FontAwesomeIcon size='lg' icon={faFilter} />
                                    </Button>
                                </Col>
                                <Col lg={3}>
                                    <Button variant='outline-danger'>
                                        <FontAwesomeIcon size='lg' icon={faMagnifyingGlass} />
                                    </Button>
                                </Col>
                                <Col lg={3}>
                                    <Button variant='outline-danger'>
                                        <FontAwesomeIcon size='lg' icon={faPencil} />
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                        <Container>
                            <Row className='g-3'>
                                <Col lg={3}>
                                    <Button variant='outline-danger' className=''>
                                        <FontAwesomeIcon size='lg' icon={faRectangleXmark} />
                                    </Button>
                                </Col>
                                <Col lg={3}>
                                    <Button variant='outline-danger'>
                                        <FontAwesomeIcon size='lg' icon={faRotate} spin={true} />
                                    </Button>
                                </Col>
                                <Col lg={3}>
                                    <Button variant='outline-danger'>
                                        <FontAwesomeIcon size='lg' icon={faXmark} />
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
