import { Button, Col, Container, Row } from "react-bootstrap";
import { TableComponent } from "../../commons/TableComponent";
import { DropdownFilterComponent } from "../../commons/DropdownFilterComponent";
import { SearchComponent } from "../../commons/SearchComponent";

type Props = {

}
function function1() {
}
export const ManageUserComponent = (props: Props) => (
	<>
		<div>
			<h4 className="nashtech-red">User List</h4>
		</div>
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
				<TableComponent headers={[]} datas={[]}  ></TableComponent>
			</Row>
		</Container>
	</>
)
