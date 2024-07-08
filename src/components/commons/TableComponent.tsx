import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import '../../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Col, Container, Row, Table } from "react-bootstrap";
import { TableHeaderModel } from '../../models/TableHeaderModel'
import { FunctionalIconModel } from '../../models/FunctionalIconModel'

type Props = {
	headers: TableHeaderModel[];
	setSortString: any;
	datas: Object[]

	//auxData and auxHeader item should have exact index as data
	auxData: Object[];
	auxHeader: Object[];
	buttons: FunctionalIconModel[];
	showModalCell: string[];

	setDummy: any;
	setModalData: any
	setModalShow: any
	pre_button: any
	setSelect?: any
	disableButton: boolean[][]
}

export const TableComponent = ({ headers, datas, auxData, buttons, setSortString, showModalCell, setModalData, setModalShow, pre_button, setSelect, disableButton }: Props) => {
	const [header, setHeader] = useState(headers);
	const cellCLickStyle = 'cell text-truncate'
	const handleClick = (e: React.MouseEvent<any>, key: object) => {
		const targetElement = e.target as HTMLElement;
		const className = targetElement.className;
		setModalData(key);
		if (className === cellCLickStyle || className === "modalClick") {
			setModalShow(true);
		}
	};

	function onClickSort(h: TableHeaderModel, index: number) {
		let dir = h.direction;
		header.forEach((a) => {
			a.isCurrentlySorted = false;
		})
		h.direction = !dir;
		h.isCurrentlySorted = true;
		header[index] = h;
		setHeader([...header]);
		let t = h.value + "," + (h.direction ? "asc" : "desc")
		setSortString((sortString: any) => ({ ...sortString, sort: t }));
	}
	return (
		<>
			<Container style={{ maxWidth: "100%", width: "100%" }}>
				<Table hover responsive className='table' id='table'>
					<thead id='table-header'>
						<tr>
							{headers?.map((h, index) => (
								<th key={h.name} className={""} style={h.style}>
									{h.name.length > 0 ?
										<div className={'table-header header-border ' + (h.isCurrentlySorted ? "sorting-header" : "")}>
											{h.name}
											{h.sort ?
												<FontAwesomeIcon values={h.name}
													icon={h.direction ? faSortDown : faSortUp}
													// icon={ faSort}
													onClick={() => { onClickSort(h, index); }} style={{ marginLeft: "10px" }} />
												: ""}
										</div>
										: '\u200B'
									}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{datas?.map((data: Object, index) => (
							<tr key={index} onClick={(e) => { handleClick(e, auxData[index]) }}>
								{pre_button ? <td>{pre_button(data, setSelect)}</td> : ""}
								{
									Object.entries(data).map(([key, value], idx) => {
										if (showModalCell.includes(key)) {
											return (
												<td key={idx} className='modalClick' style={headers[idx].colStyle}>
													<div className={cellCLickStyle}>
														{value?.toString() || '\u200B'}
													</div>
												</td>
											)
										} else {
											return (
												<td key={idx} className='' style={headers[idx].colStyle}>
													<div className='cellnoClick text-truncate'>
														{value?.toString() || '\u200B'}
													</div>
												</td>
											)
										}
									}
									)
								}
								<td className='last-cell '>
									<Row className='g-3 justify-content-center'>
										{buttons?.map((button: FunctionalIconModel, bIndex) => (
											<Col key={bIndex} id={'table_icon_' + bIndex + index} className='d-flex justify-content-end'>
												<FontAwesomeIcon
													size='lg'
													className={disableButton[index][bIndex] ? "disable-icon" : "normal-icon"}
													icon={button.icon}
													onClick={(e) => { disableButton[index][bIndex] ? () => { } : button.onClickfunction(e, auxData[index], data) }}
													fontWeight={700}
													style={button.style} />
											</Col>
										))}
									</Row>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Container>
			<></>
		</>
	)
}
