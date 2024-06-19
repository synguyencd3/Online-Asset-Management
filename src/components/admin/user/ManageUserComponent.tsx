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
import { useLocation, useNavigate } from "react-router-dom";
import { CORS_CONFIG, LOCAL_SERVICE_API } from "../../../utils/Config";

type Props = {
}
const header = [{ name: 'Staff Code', sort: true }, { name: 'Full Name', sort: true }, { name: 'Username', sort: true }, { name: 'Join Date', sort: true }, { name: 'Type', sort: true },]
const modalHeader = ["Staff Code", "Full Name", "Username", "Date of Birth", "Gender", "Joined Date", "Type", "Location"]
export const ManageUserComponent = (/*props: Props*/) => {

	const navigate = useNavigate();

	const [modalUsers, setModalUsers] = useState<ModalUserModel[]>([]);

	const [tableUser, setTableUser] = useState<UserForTableModel[]>([]);

	const [searchParam, setSearchParam] = useState("");

	const [filterParam, setFilterParam] = useState([Roles.ADMIN.toString(), Roles.STAFF.toString()]);

	const [pageParam, setPageParam] = useState([]);


	const location = useLocation();

	const [newUser] = useState<UserModel>(location.state?.newUser);

	let url = LOCAL_SERVICE_API + '/users';

	// 'http://localhost:8080/api/v1/users?search=Nhat%20Tran&types=1,2&page=0&size=10&sort=id,desc' 

	useEffect(() => {
		getUser(url)
	}, [])

	async function getUser(url: string) {
		await axios.get(
			url,
			CORS_CONFIG
		).then((response) => {
			// check status
			let data = response.data.data;
			let users: UserModel[] = data.content;

			let tableDatas: UserForTableModel[] = [];

			let modalDatas: ModalUserModel[] = [];
			if (newUser) {
				let data: UserForTableModel = {
					staffCode: newUser.staffCode,
					fullname: newUser.firstName + " " + newUser.lastName,
					username: newUser.username,
					joinedDate: newUser.joinedDate,
					type: newUser.roleId,
				};

				tableDatas.push(data);
				let modal: ModalUserModel = {
					staffCode: newUser.staffCode,
					fullName: newUser.firstName + " " + newUser.lastName,
					username: newUser.username,
					dateOfBirth: newUser.dateOfBirth,
					gender: newUser.gender,
					joinedDate: newUser.joinedDate,
					roleId: Roles[newUser.roleId],
					location: newUser.location,
				}
				modalDatas.push(modal);
			}
			users.map(user => {
				if (newUser && newUser.id === user.id) { } else {
					let data: UserForTableModel = {
						staffCode: user.staffCode,
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
				}
			})
			setModalUsers([...modalDatas]);
			setTableUser([...tableDatas]);
		}).catch(e => { console.log(e); window.alert(e) });
		window.history.replaceState({}, '')
	}

	function InitializeQuery() {
		url = url + "?" + "search=" + encodeURIComponent(searchParam) + "&" + "types=" + filterParam.join() + "&" + "page=0" + "&" + "size=10" + "&" + "sort=id,desc";
		getUser(url);
	}

	// button
	const buttons: FunctionalIconModel[] = [];

	function editUser(...data: any[]) {
		navigate('/admin/manage-users/edit', { state: { user: data[1] } })
	}

	function deleteUser(...data: any[]) {
		window.alert(data)
	}

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

	buttons.push(editIcon, deleteIcon);

	//--------------------------- 

	// Dropdown Filter
	let filterdata = [];
	let data1 = { label: "Admin", value: Roles.ADMIN.toString() }
	let data2 = { label: "Staff", value: Roles.STAFF.toString() }
	filterdata.push(data1, data2);

	//---------------------------

	return (
		<Container style={{ maxWidth: "100%" }} className="p-4">
			<Row className="py-4 ">
				<Col className="d-flex justify-content-center align-items-center">
					<DropdownFilterComponent title={"Type"} data={filterdata} params={filterParam} setParamsFunction={setFilterParam} initFunction={InitializeQuery}></DropdownFilterComponent>
				</Col>
				<Col className="d-flex justify-content-center align-items-center">
					<SearchComponent placeholder={""} url={url} params={searchParam} setParamsFunction={setSearchParam} initFunction={InitializeQuery}></SearchComponent>
				</Col>
				<Col className="d-flex justify-content-center align-items-center">
					<Button variant="danger" onClick={() => { return navigate('./new') }}>Create New User</Button>
				</Col>
			</Row>
			<Row>
				<TableComponent headers={header} datas={tableUser} url={url} auxData={modalUsers} auxHeader={modalHeader} buttons={buttons}  ></TableComponent>
			</Row>
			<Row>
				{/* Pagination */}
			</Row>
		</Container>
	);
}
