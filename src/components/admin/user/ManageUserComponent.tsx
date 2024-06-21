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
import { CORS_CONFIG, AZURE_SERVICE_API } from "../../../utils/Config";
import { PaginationComponent } from "../../commons/PaginationComponent";
import { LoaderComponent } from "../../commons/LoaderComponent";
import { ConfirmModalComponent } from "../../commons/ConfirmModalComponent";
import { message } from "antd";
import { disableUser } from "../../../services/UserService";
const header = [{ name: 'Staff Code', value: "staffCode", sort: true, direction: true }, { name: 'Full Name', value: "firstName", sort: true, direction: true }, { name: 'Username', value: "username", sort: false, direction: true }, { name: 'Joined Date', value: "joinedDate", sort: true, direction: true }, { name: 'Type', value: "roleId", sort: true, direction: true },]
const showModalCell = ["staffCode", "username", "fullName"]
const modalHeader = ["Staff Code", "Full Name", "Username", "Date of Birth", "Gender", "Joined Date", "Type", "Location"]

export const ManageUserComponent = (/*props: Props*/) => {

	const navigate = useNavigate();

	const [modalUsers, setModalUsers] = useState<ModalUserModel[]>([]);

	const [tableUser, setTableUser] = useState<UserForTableModel[]>([]);

	const [loading, setLoading] = useState(true);


	// limit the API call per param properties by using dummy, use setDummy(Math.random()) to init the query with param
	const [param, setParam] = useState({
		search: "",
		sort: "firstName,asc",
		types: [Roles.ADMIN.toString(), Roles.STAFF.toString()],
		page: 0,
		size: 20
	});
	const [dummy, setDummy] = useState(1);

	const [totalPage, setTotalPage] = useState(0);

	const location = useLocation();

	const [newUser] = useState<UserModel>(location.state?.newUser);

    const [showDisableModal, setShowDisableModal] = useState(false); // State for the Logout Modal
    const [disableStaffCode, setDisableStaffCode] = useState(''); // State for the Logout Modal

    const [messageApi, contextHolder] = message.useMessage();

	let url = AZURE_SERVICE_API + '/users';
	

	useEffect(() => {
		InitializeQuery()
	}, [dummy])

	async function getUser(url: string) {
		setLoading(true)
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
			setParam((p: any) => ({ ...p, page: data.currentPage }));
			setTotalPage(data.totalPage);
		}).catch(e => {
			message.error(e.message);
		});
		setLoading(false);
		window.history.replaceState({}, '')
	}

	function InitializeQuery() {
		let new_url = url + "?"
			+ "search=" + encodeURIComponent(param.search) + "&"
			+ "types=" + param.types.join() + "&"
			+ "page=" + param.page + "&"
			+ "size=" + "20" + "&"
			+ "sort=" + param.sort;
		getUser(new_url);
	}

	// button
	const buttons: FunctionalIconModel[] = [];

	function editUser(...data: any[]) {
		navigate('/admin/manage-users/edit', { state: { user: data[1] } })
	}

	function deleteUser(...data: any[]) {
		// window.alert(data)
		console.log(data[1]);
		handleDisableClick(data[1].staffCode);
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

	// Disable User
	const handleDisableClick = (staffCode: string) => {
        setShowDisableModal(true)
		setDisableStaffCode(staffCode); // Show the Disable Modal
    }

	const handleDisable = async (staffCode : string) => {
        messageApi.open({
            type: 'loading',
            content: 'Disabling user...',
        })
            .then(async () => {
                console.log(import.meta.env.VITE_AZURE_BACKEND_DOMAIN);
                await disableUser(staffCode)
                    .then((res) => {
                        console.log(res);
                        if (res.status == 200) {
                            console.log(res.data);
                            message.success(res.data.message);
							setDummy(Math.random());
                        }
                    })
                    .catch((err) => {
						console.log(err.response);
                        console.log(process.env.REACT_APP_AZURE_BACKEND_DOMAIN);
                        // const errorData = err.response.data.substring(0, err.response.data.indexOf('}') + 1);
                        // const errorResponse: ErrorResponse = JSON.parse(errorData);
                        message.error(`${err.response.message}`);
                    });
            });
    }

    const handleDisableConfirm = () => {
        setShowDisableModal(false);
        handleDisable(disableStaffCode); // Call the Disable function
    }

    const handleDisableCancel = () => {
        setShowDisableModal(false);
		setDisableStaffCode('') // Hide the Disable Modal
    }

	// Dropdown Filter
	let filterdata = [];
	let data1 = { label: "Admin", value: Roles.ADMIN.toString() }
	let data2 = { label: "Staff", value: Roles.STAFF.toString() }
	filterdata.push(data1, data2);
	//----------------------------

	return (
		<Container style={{ maxWidth: "100%" }} className="p-4">
			{contextHolder}
			<Row className="py-4 me-3">
				<Col sm={3} className="d-flex justify-content-start align-items-center">
					<DropdownFilterComponent title={"Type"} data={filterdata} params={param.types} setParamsFunction={setParam} setDummy={setDummy}></DropdownFilterComponent>
				</Col>
				<Col className="d-flex justify-content-end align-items-center">
					<SearchComponent placeholder={""} params={param.search} setParamsFunction={setParam} setDummy={setDummy}></SearchComponent>
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
								{/* this initfucntion */}
								<TableComponent headers={header} datas={tableUser} auxData={modalUsers} auxHeader={modalHeader} buttons={buttons} setSortString={setParam} showModalCell={showModalCell} setDummy={setDummy}  ></TableComponent>
							</Row>
							<PaginationComponent currentPage={param.page} setCurrentPage={setParam} totalPage={totalPage} setDummy={setDummy} ></PaginationComponent>
						</>
					}
				</>
			}
			<ConfirmModalComponent show={showDisableModal} onConfirm={handleDisableConfirm} onCancel={handleDisableCancel} confirmTitle={'Are you sure?'} confirmQuestion={'Do you want to disable this user?'} confirmBtnLabel={'Disable'} cancelBtnLabel={'Cancel'} />
		</Container>
	);
}