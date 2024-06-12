import { faCheck, faFilter, faMagnifyingGlass, faPencil, faRectangleXmark, faRotate, faSortDown, faSortUp, faUserPen, faXmark } from '@fortawesome/free-solid-svg-icons'
import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import { Col, Container, Row, Table } from "react-bootstrap";
export const TableComponent = () => {
    const [header, setHeader] = useState([{ name: "Header 1", sort: true }, { name: "Header 2", sort: true }, { name: "Header 3", sort: true }, { name: "Header 4", sort: true }, { name: "Header 5", sort: true }, { name: "Header 6", sort: true }, { name: "Header 7", sort: true }]);
    return (
        <Container style={{maxWidth:"100%", width:"100%"}}>
            <Row>
                <Col>
                    <Table className='table'>
                        <thead>
                            <tr>
                                {header && header.map((h, index) => (
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
                            <tr>
                                <td>Cell 11</td>
                                <td>Cell 11</td>
                                <td>Cell 11</td>
                                <td>Cell 11</td>
                                <td>Cell 12</td>
                                <td>Cell 13</td>
                                <td>Cell 14</td>
                                <td className='last-cell'>
                                    <FontAwesomeIcon icon={faCheck} style={{ color: "#ff0000", }} onClick={e => { console.log(e) }} />
                                    <button><FontAwesomeIcon icon={faCheck} style={{ color: "#ff0000", }} /> </button>
                                    <button><FontAwesomeIcon icon={faUserPen} /></button>
                                    <button><FontAwesomeIcon icon={faCircleXmark} /></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Cell 21</td>
                                <td>Cell 21</td>
                                <td>Cell 21</td>
                                <td>Cell 21</td>
                                <td>Cell 22</td>
                                <td>Cell 23</td>
                                <td>Cell 24</td>
                                <td className='last-cell'>
                                    <button><FontAwesomeIcon icon={faPencil} /></button>
                                    <button><FontAwesomeIcon icon={faRectangleXmark} /></button>
                                    <button><FontAwesomeIcon icon={faFilter} /></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 32</td>
                                <td>Cell 33</td>
                                <td>Cell 34</td>
                                <td className='last-cell'>
                                    <button><FontAwesomeIcon icon={faSortUp} /></button>
                                    <button><FontAwesomeIcon icon={faSortDown} /></button>
                                    <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 32</td>
                                <td>Cell 33</td>
                                <td>Cell 34</td>
                                <td className='last-cell'>
                                    <button><FontAwesomeIcon icon={faXmark} /></button>
                                    <button><FontAwesomeIcon icon={faRotate} spin /></button>
                                    <button>Button</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 32</td>
                                <td>Cell 33</td>
                                <td>Cell 34</td>
                                <td className='last-cell'><button>Button</button><button>Button</button><button>Button</button></td>
                            </tr>
                            <tr>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 31</td>
                                <td>Cell 32</td>
                                <td>Cell 33</td>
                                <td>Cell 34</td>
                                <td className='last-cell'><button>Button</button><button>Button</button><button>Button</button></td>
                            </tr>

                        </tbody>

                    </Table>
                </Col>
            </Row>
        </Container>
    )
}
