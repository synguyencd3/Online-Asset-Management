import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import '../../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Col, Container, Row, Table } from "react-bootstrap";
import { TableHeaderModel } from '../../models/TableHeaderModel'
import { InfoModalComponent } from './InfoModalComponent'
import { FunctionalIconModel } from '../../models/FunctionalIconModel'

type Props = {
	headers: TableHeaderModel[];
	datas: Object[]

	// By map(), auxData and auxHeader item should have exact index as data
	auxData: Object[];
	auxHeader: Object[];

	//Button
	buttons: FunctionalIconModel[];
	///
	url: string
}

export const TableComponent = ({ headers, datas, url, auxData, auxHeader, buttons }: Props) => {

	const [header, setHeader] = useState(headers);

	const [modalShow, setModalShow] = useState(false);
	
	const [modalData, setModalData] = useState<Object>({});

	
	const handleClick = (e: React.MouseEvent<HTMLTableRowElement>, key: object) => {
		const targetElement = e.target as HTMLElement;
		const className = targetElement.className;
		if (className === "cell" || className === "modalClick") {
			setModalData(key);
			setModalShow(true);
		}
	};

	return (
		<>
			<InfoModalComponent
				title={"Detailed User Infomation"}
				show={modalShow}
				onHide={() => setModalShow(false)}
				label={auxHeader}
				data={modalData}
				url={url}
			/>

			<Container style={{ maxWidth: "100%", width: "100%" }}>
				<Row>
					<Col>
						<Table hover responsive className='table'>
							<thead>
								<tr>
									{headers?.map((h, index) => (
										<th key={h.name}>
											<div className='table-header header-border'>
												{h.name}
												<FontAwesomeIcon values={h.name} icon={h.sort ? faSortDown : faSortUp} onClick={() => { h.sort = !h.sort; header[index] = h; setHeader([...header]) }} />
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{datas?.map((data: Object, index) => (
									<tr key={index} onClick={(e) => { handleClick(e, auxData[index]) }}>
										{
											Object.values(data).map((value: any, idx) => (
												<td key={idx} className='modalClick'>
													<div className='cell'>
														{value?.toString()}
													</div>
												</td>
											))
										}
										<td className='last-cell'>
											<Container>
												<Row className='g-3'>
													{buttons?.map((data: FunctionalIconModel) => (
														<Col lg={3}>
															<FontAwesomeIcon size='lg' icon={data.icon} onClick={data.onClickfunction} style={data.style} />
														</Col>
													))}
												</Row>
											</Container>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</Col>
				</Row>
			</Container>
		</>
	)
}
