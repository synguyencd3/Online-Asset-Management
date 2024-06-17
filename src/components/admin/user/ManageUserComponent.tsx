import { Button, Col, Container, Row } from "react-bootstrap";
import { TableComponent } from "../../commons/TableComponent";
import { DropdownFilterComponent } from "../../commons/DropdownFilterComponent";
import { SearchComponent } from "../../commons/SearchComponent";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserModel } from "../../../models/UserModel";
import { UserForTableModel } from "../../../models/UserForTableModel";
import { ModalUserModel } from "../../../models/ModalUserModel";
import { Roles } from "../../../utils/Enum";
import { FunctionalIconModel } from "../../../models/FunctionalIconModel";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";

type Props = {
	url: string
}
const header = [{ name: 'Staff Code', sort: true }, { name: 'Full Name', sort: true }, { name: 'Username', sort: true }, { name: 'Join Date', sort: true }, { name: 'Type', sort: true },]
const modalHeader = ["Staff Code", "Full Name", "Username", "Date of Birth", "Gender", "Joined Date", "Type", "Location"]
export const ManageUserComponent = (props: Props) => {

	const [modalUsers, setModalUsers] = useState<ModalUserModel[]>([]);

	const [tableUser, setTableUser] = useState<UserForTableModel[]>([]);


	const url = props.url + 'users';


	useEffect(() => {
		getUser()
	}, [])

	function getUser() {
		axios({
			method: 'get',
			url: url,
		}).then((response) => {
			// check status
			let data = response.data.data;
			let u: UserModel[] = data.content;


			let tableDatas: UserForTableModel[] = [];
			let modalDatas: ModalUserModel[] = [];

			u.map(user => {
				let data: UserForTableModel = {
					staffCode: user.staffCode,
					// staffCode: user.id.toString(),
					fullname: user.firstName + " " + user.lastName,
					username: user.username,
					joinedDate: user.joinedDate,
					type: user.roleId,
				};
				tableDatas.push(data);
				let modal: ModalUserModel = {
					staffCode: user.staffCode,
					fullName: user.firstName + " " + user.lastName,
					username: user.username,
					dateOfBirth: user.dateOfBirth,
					gender: user.gender,
					joinedDate: user.joinedDate,
					roleId: Roles[user.roleId],
					location: user.location,
				}
				modalDatas.push(modal);
			})
			setModalUsers([...modalDatas]);
			setTableUser([...tableDatas]);
		}).catch(e => { console.log(e); window.alert(e) });
	}
	// button
	function editUser(e: React.MouseEvent<SVGElement>) {
		window.alert(e.target)
	}
	function deleteUser(e: React.MouseEvent<SVGElement>) {
		window.alert(e.target)

	}
	const buttons: FunctionalIconModel[] = [];
	const editIcon: FunctionalIconModel = {
		icon: faPencil,
		style: "",
		onClickfunction: editUser
	};
	const deleteIcon: FunctionalIconModel = {
		icon: faCircleXmark,
		style: { color: 'red' },
		onClickfunction: deleteUser
	};
	buttons.push(editIcon);
	buttons.push(deleteIcon);
	///


	return (
		<Container style={{ maxWidth: "100%" }} className="p-4">
			<Row className="py-4 ">
				<Col className="d-flex justify-content-center align-items-center">
					<DropdownFilterComponent title={"Type"}></DropdownFilterComponent>
				</Col>
				<Col className="d-flex justify-content-center align-items-center">
					<SearchComponent placeholder={null}></SearchComponent>
				</Col>
				<Col className="d-flex justify-content-center align-items-center">
					<Button variant="danger"> Create New User</Button>
				</Col>
			</Row>
			<Row>
				<TableComponent headers={header} datas={tableUser} url={url} auxData={modalUsers} auxHeader={modalHeader} buttons={buttons}  ></TableComponent>
			</Row>
		</Container>
	);
}
