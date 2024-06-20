import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import '../../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Col, Container, Row, Table } from "react-bootstrap";
import { TableHeaderModel } from '../../models/TableHeaderModel'
import { InfoModalComponent } from './InfoModalComponent'
import { FunctionalIconModel } from '../../models/FunctionalIconModel'

type Props = {
	headers: TableHeaderModel[];
	sortString: any
	setSortString: any;
	initFunction: () => void
	datas: Object[]

	// By map(), auxData and auxHeader item should have exact index as data
	auxData: Object[];
	auxHeader: Object[];

	//Button
	buttons: FunctionalIconModel[];
	///
	url: string
	showModalCell: string[];
}

export const TableComponent = ({ headers, datas, url, auxData, auxHeader, buttons, sortString, setSortString, initFunction, showModalCell }: Props) => {

	const [header, setHeader] = useState(headers);

	const [modalShow, setModalShow] = useState(false);

	const [modalData, setModalData] = useState<Object>({});

	useEffect(() => {
		initFunction();
	}, [sortString])

	const handleClick = (e: React.MouseEvent<any>, key: object) => {
		const targetElement = e.target as HTMLElement;
		const className = targetElement.className;
		setModalData(key);
		if (className === "cell" || className === "modalClick") {
			setModalShow(true);
		}
	};

	function onClickSort(h: TableHeaderModel, index: number) {
		h.direction = !h.direction;
		header[index] = h;
		setHeader([...header]);
		let t = h.value + "," + (h.direction ? "asc" : "desc")
		setSortString((sortString: any) => ({ ...sortString, sort: t }));
		// initFunction();
	}
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

				<Table hover responsive className='table'>
					<thead>
						<tr>
							{headers?.map((h, index) => (
								<th key={h.name}>
									<div className='table-header header-border'>
										{h.name}
										{h.sort ?
											<FontAwesomeIcon values={h.name} icon={h.direction ? faSortDown : faSortUp} onClick={() => { onClickSort(h, index); }} />
											: ""}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{datas?.map((data: Object, index) => (
							<tr key={index} onClick={(e) => { handleClick(e, auxData[index]) }}>
								{
									Object.entries(data).map(([key, value], idx) => {
										if (showModalCell.includes(key)) {
											return (
												<td key={idx} className='modalClick'>
													<div className='cell'>
														{value?.toString()}
													</div>
												</td>
											)
										} else {
											return (
												<td key={idx}>
													<div className='cellnoClick'>
														{value?.toString()}
													</div>
												</td>
											)
										}
									}
									)
								}
								<td className='last-cell'>
										<Row className='g-3 justify-content-around'>
											{buttons?.map((button: FunctionalIconModel, bIndex) => (
												<Col key={bIndex} lg={3}>
													<FontAwesomeIcon size='lg' icon={button.icon} onClick={(e) => { button.onClickfunction(e, auxData[index], data) }} style={button.style} />
												</Col>
											))}
										</Row>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Container>
		</>
	)
}
