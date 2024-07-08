import { Button, Col, Container, Row } from "react-bootstrap";
import { TableComponent } from "../../commons/TableComponent";
import { DropdownFilterComponent } from "../../commons/DropdownFilterComponent";
import { SearchComponent } from "../../commons/SearchComponent";
import { ReactNode, useEffect, useState } from "react";
import { UserModel, UserParamModel } from "../../../models/UserModel";
import { UserForTableModel } from "../../../models/UserModel";
import { ModalUserModel } from "../../../models/UserModel";
import { Roles, RolesLowerCase } from "../../../utils/Enum";
import { FunctionalIconModel } from "../../../models/FunctionalIconModel";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";
import { useLocation, useNavigate } from "react-router-dom";
import { PaginationComponent } from "../../commons/PaginationComponent";
import { LoaderComponent } from "../../commons/LoaderComponent";
import { ConfirmModalComponent } from "../../commons/ConfirmModalComponent";
import { message } from "antd";
import { disableUser, getUserUrl, userFetcher } from "../../../services/UserService";
import { DetailModalComponent } from "../../commons/DetailModalComponent";
import { BreadcrumbComponent } from "../../commons/BreadcrumbComponent";
import useSWR from "swr";
import { ColorPalette } from "../../../utils/ColorPalette";
import { TableHeaderModel } from "../../../models/TableHeaderModel";
import { DropdownFilterModel } from "../../../models/DropdownFilterModel";

const header: TableHeaderModel[] = [
	{ name: 'Staff Code', value: "staffCode", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
	{ name: 'Full Name', value: "firstName", sort: true, direction: true, colStyle: {}, isCurrentlySorted: true, style: {} },
	{ name: 'Username', value: "username", sort: false, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
	{ name: 'Joined Date', value: "joinedDate", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
	{ name: 'Type', value: "roleId", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
]
const showModalCell = ["staffCode", "username", "fullName"]
const modalHeader = ["Staff Code", "Full Name", "Username", "Date of Birth", "Gender", "Joined Date", "Type", "Location"]

type Props = {
	setHeaderTitle: (title: ReactNode) => void
}

export const ManageUserComponent = (props: Props) => {

	const navigate = useNavigate();
	const location = useLocation();
	const [messageApi, contextHolder] = message.useMessage();

	const [param, setParam] = useState<UserParamModel>({
		search: "",
		sort: "firstName,asc",
		types: [Roles.ADMIN.toString(), Roles.STAFF.toString()],
		self: false,
		page: 0,
		size: 20
	});

	const [_dummy, setDummy] = useState(1);

	let newUser: UserModel | undefined = location.state?.newUser;

	const [modalShow, setModalShow] = useState(false);
	const [modalData, setModalData] = useState<Object>({});

	const [showDisableModal, setShowDisableModal] = useState(false); // State for the Logout Modal
	const [disableStaffCode, setDisableStaffCode] = useState(''); // State for the Logout Modal

	// const [disableButton, setDisableButton] = useState<boolean[][]>([])

	function toDateString(date: string) {
		let d = new Date(date);
		return new Intl.DateTimeFormat("en-GB").format(d);
	}

	useEffect(() => {
		props.setHeaderTitle(<BreadcrumbComponent breadcrumb={[{
			title: 'Manage User',
			href: `${window.location.origin}/admin/manage-users#`
		}]} />);
	}, [])


	const handleSetParam = (func: (p: UserParamModel) => UserParamModel) => {
		const newParam = func(param);
		if (newParam.page === param.page) {
			newParam.page = 0;
		}
		setParam(newParam);
		if (newUser) {
			navigate(location.pathname, { state: { newUser: undefined } });
		}
	};

	const { data: user, isLoading: isLoadingUser, mutate: mutateUser } = useSWR(getUserUrl(param), userFetcher, {
		onError: () => {
			message.error("Cannot Get User")
		},
		shouldRetryOnError: false,
		revalidateOnFocus: false,
	});
	console.log(user);

	let tableUser: UserForTableModel[] = [];
	let modalUsers: ModalUserModel[] = [];
	let disableButton: boolean[][] = [];

	if (user) {
		let users = user.content;
		if (newUser) {
			let data: UserForTableModel = {
				staffCode: newUser.staffCode,
				fullName: newUser.firstName + " " + newUser.lastName,
				username: newUser.username,
				joinedDate: toDateString(newUser.joinedDate),
				type: RolesLowerCase[newUser.roleId],
			};
			tableUser.push(data);
			disableButton.push([false, false]);

			let modal: ModalUserModel = {
				staffCode: newUser.staffCode,
				fullName: newUser.firstName + " " + newUser.lastName,
				username: newUser.username,
				dateOfBirth: toDateString(newUser.dateOfBirth),
				gender: newUser.gender.charAt(0) + newUser.gender.slice(1).toLowerCase(),
				joinedDate: toDateString(newUser.joinedDate),
				roleId: RolesLowerCase[newUser.roleId],
				location: newUser.location,
			}
			modalUsers.push(modal);
		}

		users.map(user => {
			if (newUser && newUser.staffCode === user.staffCode) {
				// TODO document why this block is empty
			}
			else {
				let data: UserForTableModel = {
					staffCode: user.staffCode,
					fullName: user.firstName + " " + user.lastName,
					username: user.username,
					joinedDate: toDateString(user.joinedDate),
					type: RolesLowerCase[user.roleId],
				};
				tableUser.push(data);

				let modal: ModalUserModel = {
					staffCode: user.staffCode,
					fullName: user.firstName + " " + user.lastName,
					username: user.username,
					dateOfBirth: toDateString(user.dateOfBirth),
					gender: user.gender.charAt(0) + user.gender.slice(1).toLowerCase(),
					joinedDate: toDateString(user.joinedDate),
					roleId: RolesLowerCase[user.roleId],
					location: user.location,
				}
				modalUsers.push(modal);
				disableButton.push([false, false]);
			}
		})
		window.history.replaceState({}, '')
	}

	// button
	const buttons: FunctionalIconModel[] = [];

	function editUser(...data: any[]) {
		navigate('/admin/manage-users/edit', { state: { user: data[1] } })
	}

	function deleteUser(...data: any[]) {
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

	const handleDisable = async (staffCode: string) => {
		messageApi.open({
			type: 'loading',
			content: 'Disabling user...',
		})
			.then(async () => {
				await disableUser(staffCode)
					.then((res) => {
						if(newUser){
							navigate(location.pathname, { state: { newUser: undefined } });
						}
						if (res.status == 200) {
							message.success(res.data.message);
							if (tableUser.length === 1 && user?.currentPage !== 1) {
								handleSetParam((p) => ({ ...p, page: 0 }));
							} else {
								mutateUser();
							}
						}
					})
					.catch((err) => {
						message.error(`${err.response.data.message}`);
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
	let filterdata: DropdownFilterModel[] = [
		{ label: "Admin", value: Roles.ADMIN.toString(), defaultChecked: true },
		{ label: "Staff", value: Roles.STAFF.toString(), defaultChecked: true }
	]
	//----------------------------

	return (
		<Container>
			{contextHolder}
			<h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className='fw-bold fs-4 ms-1 mt-5 mb-3'>
				User List
			</h4>
			<Row className="py-4 ms-0 me-3 user-param-row justify-content-between">
				<Col sm={6}>
					<Row>
						<Col className="d-flex justify-content-start align-items-center px-2">
							<DropdownFilterComponent title={"Type"} data={filterdata} params={param.types} setParamsFunction={handleSetParam} setDummy={setDummy} style={{}} defaultAll={true} paramName={"types"} />
						</Col>
					</Row>
				</Col>

				<Col sm={6}>
					<Row>
						<Col sm={7} className="d-flex justify-content-end align-items-center">
							<SearchComponent placeholder={"Search Staff Code or Full Name"} setParamsFunction={handleSetParam} setDummy={setDummy} style={{}} class={""}></SearchComponent>
						</Col>
						<Col sm={5} className="d-flex justify-content-end align-items-center">
							<Button variant="danger" onClick={() => { return navigate('./new') }} style={{ width: "230px" }}>Create New User</Button>
						</Col>
					</Row>
				</Col>
			</Row>
			{isLoadingUser || !user ?
				<LoaderComponent></LoaderComponent>
				:
				<>
					{tableUser.length === 0 ?
						<Row>
							<h4 className="text-center"> No User Found</h4>
						</Row> :
						<>
							<Row className='ps-2'>
								<p className='fs-5' style={{ color: "gray" }}>
									Total : {user.totalElements}
								</p>
							</Row>
							<Row>
								{/* this initfucntion */}
								<TableComponent headers={header} datas={tableUser} auxData={modalUsers} auxHeader={modalHeader} buttons={buttons} setSortString={handleSetParam} showModalCell={showModalCell} setDummy={setDummy} setModalData={setModalData} setModalShow={setModalShow} pre_button={undefined} disableButton={disableButton} />
							</Row>
							<PaginationComponent currentPage={param.page} setParamsFunction={handleSetParam} totalPage={user.totalPage} perPage={param.size} fixPageSize={false} ></PaginationComponent>
						</>
					}
				</>
			}
			<DetailModalComponent
				title={"Detailed User Information"}
				show={modalShow}
				onHide={() => setModalShow(false)}
				label={modalHeader}
				data={modalData}
			/>
			<ConfirmModalComponent show={showDisableModal} onConfirm={handleDisableConfirm} onCancel={handleDisableCancel} confirmTitle={'Disable Confirmation'} confirmQuestion={'Do you want to disable this user?'} confirmBtnLabel={'Disable'} cancelBtnLabel={'Cancel'} modalSize={"md"} />
		</Container>
	);
}