import { faArrowRotateLeft, faCheck, faFilter, faMagnifyingGlass, faPencil, faRectangleXmark, faRotate, faRotateBack, faRotateBackward, faSortDown, faSortUp, faUserPen, faXmark } from '@fortawesome/free-solid-svg-icons'
import '../../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import { Button, Col, Container, Modal, Row, Table } from "react-bootstrap";

import { header as headers, assignments } from "../../utils/MockData";
import { Assignment } from '../../models/UserModel'
import { InfoModal } from './InfoModal'

type Props = {
	headers: { name: string, sort: boolean }[];
	datas: {}[]
}

export const TableComponent = (tableOptions: Props) => {
	const [header, setHeader] = useState(headers);

	const [modalShow, setModalShow] = useState(false);
	const [modalData, setModalData] = useState({}); ""
	const handleClick = (e: React.MouseEvent<HTMLTableRowElement>, assignment: Assignment) => {
		const targetElement = e.target as HTMLElement;
		const className = targetElement.className;
		if (className === "cell") {
			setModalData(assignment);
			setModalShow(true);
		}
	};


	return (
		<>
			<InfoModal
				title={"Detailed User Infomation"}
				show={modalShow}
				onHide={() => setModalShow(false)}
				data={modalData}
			/>
			<></>
			<Container style={{ maxWidth: "100%", width: "100%" }}>
				<Row>
					<Col>
						<Table hover className='table'>
							<thead>
								<tr>
									{header?.map((h, index) => (
										<th key={h.name}>
											<div className='table-header header-border'>
												{h.name}
												<FontAwesomeIcon values={h.name} icon={h.sort ? faSortDown : faSortUp} onClick={(e) => { h.sort = !h.sort; header[index] = h; setHeader([...header]) }} />
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{assignments?.map((a, index) => (
									<tr key={a.id} onClick={(e) => { handleClick(e, a) }}>
										<td>
											<div className='cell'>
												{a.id}
											</div>
										</td>
										<td>
											<div className='cell'>
												{a.assetCode}
											</div>
										</td>
										<td>
											<div className='cell'>
												{a.assetName}
											</div>
										</td>
										<td>
											<div className='cell'>
												{a.assignedTo}
											</div>
										</td>
										<td>
											<div className='cell'>
												{a.assignedBy}
											</div>
										</td>
										<td>
											<div className='cell'>
												{a.assignedDate}
											</div>
										</td>
										<td>
											<div className='cell'>
												{a.state}
											</div>
										</td>
										<td className='last-cell'>
											<Container>
												<Row className='g-3'>
													<Col lg={3}>
														<FontAwesomeIcon size='lg' icon={faPencil} onClick={(e) => { window.alert("You Click Edit") }} />
													</Col>
													<Col lg={3}>
														<FontAwesomeIcon size='lg' className='xMark' icon={faCircleXmark} onClick={(e) => { window.alert("You Click Remove") }} />
													</Col>
													<Col lg={3}>
														<FontAwesomeIcon size='lg' style={{ color: "blue" }} icon={faArrowRotateLeft} onClick={(e) => { window.alert("You Click Restart") }} />
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
