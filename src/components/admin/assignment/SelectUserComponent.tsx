import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { TableComponent } from "../../commons/TableComponent"
import { ColorPalette } from "../../../utils/ColorPalette"
import { LoaderComponent } from "../../commons/LoaderComponent"
import { PaginationComponent } from "../../commons/PaginationComponent"
import { useState } from "react"
import { message } from 'antd';
import { UserModel, UserParamModel } from "../../../models/UserModel"
import { UserForSelectTableModel } from "../../../models/UserModel"
import { Roles, RolesLowerCase } from "../../../utils/Enum"
import { getUserUrl, userFetcher } from "../../../services/UserService"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DropdownSearchComponent } from "../../commons/DropDownSearchComponent"
import { TableHeaderModel } from "../../../models/TableHeaderModel"
import useSWR from "swr"

const header: TableHeaderModel[] = [
	{ name: '', value: "", sort: false, direction: false, colStyle: { width: "20%" }, isCurrentlySorted: false, style: {} },
	{ name: 'Staff Code', value: "staffCode", sort: true, direction: true, colStyle: { width: "20%" }, isCurrentlySorted: false, style: {} },
	{ name: 'Username', value: "username", sort: true, direction: true, colStyle: { width: "40%" }, isCurrentlySorted: false, style: {} },
	{ name: 'Full Name', value: "firstName", sort: true, direction: true, colStyle: { width: "50%" }, isCurrentlySorted: false, style: {} },
	{ name: 'Type', value: "roleId", sort: true, direction: true, colStyle: { width: "10%" }, isCurrentlySorted: false, style: {} },
]

type Props = {
	setSelectedOnParent: any
	closeDropdown: any
}

export const SelectUserComponent = (props: Props) => {
	const [selected, setSelected] = useState<String>("")

	let tableUser: UserForSelectTableModel[] = [];

	const handleSetParam = (func: (p: UserParamModel) => UserParamModel) => {
		const newParam = func(param);
		if (newParam.page === param.page) {
			newParam.page = 0;
		}
		setParam(newParam);
	};

	const [param, setParam] = useState<UserParamModel>({
		search: "",
		sort: "firstName,asc",
		types: [Roles.ADMIN.toString(), Roles.STAFF.toString()],
		page: 0,
		self: true,
		size: 20
	});

	const { data: user, isLoading: isLoadingUser} = useSWR(getUserUrl(param), userFetcher, {
		onError: () => {			
			message.error("Fail to Load User")
		},
		shouldRetryOnError: false,
		revalidateOnFocus: false,
	});

	if (user) {
		let users = user.content;

		users.map(user => {
			
				let data: UserForSelectTableModel = {
					staffCode: user.staffCode,
					username: user.username,
					fullName: user.firstName + " " + user.lastName,
					type: RolesLowerCase[user.roleId],
				};
				tableUser.push(data);
		})
		window.history.replaceState({}, '')
	}

	const preButton = (user: UserModel, setUser: any) => {
		return (
			<Form.Check
				type={"radio"}
				name="select_user"
				onChange={() => {
					setUser(user)
				}}
			/>
		)
	}

	const save = () => {

		props.setSelectedOnParent(selected);
		props.closeDropdown()
	}

	return (
		<Container>
			<Row>
				<Col>
					<h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
						User List
					</h4>
				</Col>
				<Col>
					<DropdownSearchComponent placeholder={"Search by name"} setParamsFunction={setParam} setDummy={()=>{}} style={{ width: "100%" }}></DropdownSearchComponent>
				</Col>
			</Row>
			<Row>
				{!user ?
					<LoaderComponent></LoaderComponent>
					:
					<>
						{tableUser.length === 0 ?
							<Row>
								<h4 className="text-center"> No User Found</h4>
							</Row> :
							<>
								<Row>
									<TableComponent headers={header} datas={tableUser} auxData={[]} auxHeader={[]} buttons={[]} setSortString={handleSetParam} showModalCell={[]} setDummy={() => {}} setModalData={() => { }} setModalShow={undefined} pre_button={preButton} setSelect={setSelected} disableButton={[]}  ></TableComponent>
								</Row>
								<PaginationComponent currentPage={param.page} totalPage={user.totalPage} perPage={param.size} setParamsFunction={handleSetParam} fixPageSize={false} ></PaginationComponent>
							</>
						}
					</>
				}
			</Row>
			<Row>
				<Col className="d-flex justify-content-end my-4">
					<Button variant="danger" className="mx-4" style={{ minWidth: "100px" }} type="button" onClick={save} > {isLoadingUser ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save"}</Button>
					<Button variant="outline-dark" className="ms-4" style={{ minWidth: "100px" }} onClick={props.closeDropdown}>Cancel</Button>
				</Col>
			</Row>
		</Container>
	)
}