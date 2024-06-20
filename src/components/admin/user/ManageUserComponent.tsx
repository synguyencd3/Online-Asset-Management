import { Button, Col, Container, Row } from "react-bootstrap";
import { TableComponent } from "../../commons/TableComponent";
import { DropdownFilterComponent } from "../../commons/DropdownFilterComponent";
import { SearchComponent } from "../../commons/SearchComponent";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { UserModel } from "../../../models/UserModel";
import { UserForTableModel } from "../../../models/UserForTableModel";
import { ModalUserModel } from "../../../models/ModalUserModel";
import { Roles } from "../../../utils/Enum";
import { FunctionalIconModel } from "../../../models/FunctionalIconModel";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";
import { useLocation, useNavigate } from "react-router-dom";
import { AZURE_SERVICE_API, CORS_CONFIG, LOCAL_SERVICE_API } from "../../../utils/Config";
import { PaginationComponent } from "../../commons/PaginationComponent";
import { LoaderComponent } from "../../commons/LoaderComponent";
type Props = {
}
const header = [{ name: 'Staff Code', value: "staffCode", sort: true, direction: true }, { name: 'Full Name', value: "firstName", sort: true, direction: true }, { name: 'Username', value: "username", sort: false, direction: true }, { name: 'Joined Date', value: "joinedDate", sort: true, direction: true }, { name: 'Type', value: "roleId", sort: true, direction: true },]
const showModalCell = ["staffCode", "username", "fullName"]
const modalHeader = ["Staff Code", "Full Name", "Username", "Date of Birth", "Gender", "Joined Date", "Type", "Location"]

export const ManageUserComponent = (/*props: Props*/) => {

	const navigate = useNavigate();

	const [modalUsers, setModalUsers] = useState<ModalUserModel[]>([]);

	const [tableUser, setTableUser] = useState<UserForTableModel[]>([]);

	const [loading, setLoading] = useState(true);

	const [searchParam, setSearchParam] = useState("");

	const [filterParam, setFilterParam] = useState([Roles.ADMIN.toString(), Roles.STAFF.toString()]);

	// const [sortString, setSortString] = useState("firstName,asc")
	const [sortString, setSortString] = useState({ sort: "firstName,asc" })

	const [currentPage, setCurrentPage] = useState(0);

	const [totalPage, setTotalPage] = useState(0);

	const [totalElements, setTotalElements] = useState(0);

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
					fullName: newUser.firstName + " " + newUser.lastName,
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
						fullName: user.firstName + " " + user.lastName,
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
			setCurrentPage(data.currentPage);
			setTotalPage(data.totalPage);
			setTotalElements(data.totalElements);
		}).catch(e => { console.log(e); });
		setLoading(false);
		window.history.replaceState({}, '')
	}

	function InitializeQuery() {
		url = LOCAL_SERVICE_API + '/users' + "?" + "search=" + encodeURIComponent(searchParam) + "&" + "types=" + filterParam.join() + "&" + "page=" + currentPage + "&" + "size=10" + "&" + "sort=" + sortString.sort;

		console.log(url);

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
	function changePage(page: any, pageSize: any) {
		console.log(page, pageSize);
		InitializeQuery();
	}


	return (
		<Container style={{ maxWidth: "100%" }} className="p-4">
			<Row className="py-4 me-3">
				<Col sm={3} className="d-flex justify-content-start align-items-center">
					<DropdownFilterComponent title={"Type"} data={filterdata} params={filterParam} setParamsFunction={setFilterParam} initFunction={InitializeQuery}></DropdownFilterComponent>
				</Col>
				<Col className="d-flex justify-content-end align-items-center">
					<SearchComponent placeholder={""} url={url} params={searchParam} setParamsFunction={setSearchParam} initFunction={InitializeQuery} ></SearchComponent>
				</Col>
				<Col sm={2} className="d-flex justify-content-end align-items-center">
					<Button variant="danger" onClick={() => { return navigate('./new') }}>Create New User</Button>
				</Col>
			</Row>
			{loading ?
				<LoaderComponent></LoaderComponent>
				:
				<>
					{tableUser.length === 0 ?
						<Row>
							<h4 className="text-center"> No User Found</h4>
						</Row> :
						<>
							<Row>
								<TableComponent headers={header} datas={tableUser} url={url} auxData={modalUsers} auxHeader={modalHeader} buttons={buttons} initFunction={InitializeQuery} sortString={sortString} setSortString={setSortString} showModalCell={showModalCell}  ></TableComponent>
							</Row>
							<PaginationComponent currentPage={currentPage} totalPage={totalPage} totalElements={totalElements} initFunction={InitializeQuery} setCurrentPage={setCurrentPage} ></PaginationComponent>
						</>
					}
				</>
			}
		</Container>
	);
}
