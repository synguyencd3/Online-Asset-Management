import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { SearchComponent } from "../../commons/SearchComponent"
import { TableComponent } from "../../commons/TableComponent"
import { ColorPalette } from "../../../utils/ColorPalette"
import { LoaderComponent } from "../../commons/LoaderComponent"
import { PaginationComponent } from "../../commons/PaginationComponent"
import { useEffect, useState } from "react"
import { message } from 'antd';
import { UserModel } from "../../../models/UserModel"
import { UserForSelectTableModel } from "../../../models/UserForSelectTableModel"
import { Roles, RolesLowerCase } from "../../../utils/Enum"
import { getUser } from "../../../services/UserService"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const header = [
	{ name: '', value: "", sort: false, direction: false, colStyle: { width: "20%" } },
	{ name: 'Staff Code', value: "staffCode", sort: true, direction: true, colStyle: { width: "20%" } },
	{ name: 'Username', value: "username", sort: true, direction: true, colStyle: { width: "40%" } },
	{ name: 'Full Name', value: "firstName", sort: true, direction: true, colStyle: { width: "50%" } },
	{ name: 'Type', value: "roleId", sort: true, direction: true, colStyle: { width: "10%" } },

]

type Props = {
    setSelectedOnParent: any
	closeDropdown: any
}
export const SelectUserComponent = (props: Props) => {
	const [tableUser, setTableUser] = useState<UserForSelectTableModel[]>([]);

	const [auxData, setAuxData] = useState<UserModel[]>([]);

	const [loading, setLoading] = useState(true);

	const [totalPage, setTotalPage] = useState(0);

	const [dummy, setDummy] = useState(0);

	const [page, setPage] = useState(0);

	const [selected, setSelected] = useState<String>("")

	const [param, setParam] = useState({
		search: "",
		sort: "firstName,asc",
		types: [Roles.ADMIN.toString(), Roles.STAFF.toString()],
		page: 0,
		self: true,
		size: 20
	});
	

	async function InitializeQuery() {
		setLoading(true)
		let params = "?"
			+ "search=" + encodeURIComponent(param.search) + "&"
			+ "types=" + param.types.join() + "&"
			+ "page=" + param.page + "&"
			+ "size=" + param.size + "&"
			+ "self=" + param.self+ "&"
			+ "sort=" + param.sort

		setLoading(true)

		await getUser(params).then((response) => {
			const data = response.data.data;
			setParam((p: any) => ({ ...p, page: data.currentPage }));
			let users: UserModel[] = data.content;
			let usersforTable: UserForSelectTableModel[] = users.map(a => {
				return {
					staffCode: a.staffCode,
					username: a.username,
					fullName : a.firstName+" "+a.lastName,
					type: RolesLowerCase[a.roleId],
				}
			})
			setTableUser(usersforTable)
			setAuxData(users);
			setTotalPage(data.totalPage);
		}).catch(e => {
			message.error(e.message);
		});
		setLoading(false);
		window.history.replaceState({}, '')
	}

	useEffect(() => {
		param.page = 0
		InitializeQuery()
	}, [dummy])


	const preButton = (user: UserModel, setUser:any) => {
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

	useEffect(() => {
			InitializeQuery()
	}, [page])

	return (
		<Container>
			<Row>
				<Col>
					<h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
						User List
					</h4>
				</Col>
				<Col>
					<SearchComponent placeholder={""} setParamsFunction={setParam} setDummy={setDummy} style={{ width: "100%" }}></SearchComponent>
				</Col>
			</Row>
			<Row>
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
									<TableComponent headers={header} datas={tableUser} auxData={auxData} auxHeader={[]} buttons={[]} setSortString={setParam} showModalCell={[]} setDummy={setDummy} setModalData={() => { }} setModalShow={undefined} pre_button={preButton} setSelect={setSelected} disableButton={[]}  ></TableComponent>
								</Row>
								<PaginationComponent currentPage={param.page} totalPage={totalPage} setDummy={setPage} perPage={param.size} setParamsFunction={setParam} setPage={setPage} fixPageSize={false} ></PaginationComponent>
							</>
						}
					</>
				}
			</Row>
			<Row>
				<Col className="d-flex justify-content-end my-4">
					<Button variant="danger" className="mx-4" style={{ minWidth: "100px" }} type="button" onClick={save} > {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save"}</Button>
					<Button variant="outline-dark" className="ms-4" style={{ minWidth: "100px" }} onClick={props.closeDropdown}>Cancel</Button>
				</Col>
			</Row>
		</Container>
	)
}