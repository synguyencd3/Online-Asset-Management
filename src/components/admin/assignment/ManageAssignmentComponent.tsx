import React from 'react'
// import { Button, Col, Container, Form, Row } from 'react-bootstrap'
// import { DropdownFilterComponent } from '../../commons/DropdownFilterComponent'
// import { SearchComponent } from '../../commons/SearchComponent'
// import { AssignmentState } from '../../../utils/Enum'
// import { AZURE_SERVICE_API } from '../../../utils/Config'
// import { LoaderComponent } from '../../commons/LoaderComponent'
// import { TableComponent } from '../../commons/TableComponent'
// import { PaginationComponent } from '../../commons/PaginationComponent'
// import { FunctionalIconModel } from '../../../models/FunctionalIconModel'
// import { faCircleXmark, faPencil, faRefresh } from '@fortawesome/free-solid-svg-icons'
// import { useNavigate } from 'react-router-dom'


// let DummyData = [
//   {No: 1, AssetCode: "LA10003", AssetName: "Laptop HP Probook 440 G1", AssignedTo: "hungtv1", AssignedBy: "binhnv", AssignedDate: "12/10/2018", Status: "Accepted"},
//   {No: 2, AssetCode: "MO100004", AssetName: "Monitor Dell UltraSharp", AssugnedTo: "antv", AssignedBy: "tuanha", AssignedDAte: "15/03/2019", Status: "Waiting for acceptance"}
// ]

// const header = [{ name: 'No.', value: 'Number', sort: true, direction: true}, { name: 'Asset Code', value: 'AssetCode', sort: true, direction: true},{ name: 'Asset Name', value: 'AssetName', sort: true, direction: true},{ name: 'Assigned To', value: 'AssignedTo', sort: true, direction: true}, { name: 'Assigned By', value: 'AssignedBy', sort: true, direction: true}, { name: 'Assigned Date', value: 'Assigned Date', sort: true, direction:true}, { name: 'State', value: 'State', sort: true, direction:true}];
// const showModalCell = ["staffCode", "username", "fullName"]
// const modalHeader = ["Staff Code", "Full Name", "Username", "Date of Birth", "Gender", "Joined Date", "Type", "Location"]
export const ManageAssignmentComponent: React.FC = () => {
	return <div>ManageAssignmentComponent: React.FC</div>
//   const [filterParam, setFilterParam] = useState([AssignmentState.ACCEPTED, AssignmentState.DECLINED, AssignmentState.WATING_FOR_ACCEPTANCE]);

//   const [searchParam, setSearchParam] = useState("");

//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
  
//   let url = AZURE_SERVICE_API + '/assignments';

//   let filterdata = [];
//   let data1 = { label: "Accepted", value: AssignmentState.ACCEPTED.toString() }
// 	let data2 = { label: "Declined", value: AssignmentState.DECLINED.toString() }
//   let data3 = { label: "Waiting for acceptance", value: AssignmentState.DECLINED.toString() }
// 	filterdata.push(data1, data2, data3);

//   function InitializeQuery() {
// 		url = url + "?" + "search=" + encodeURIComponent(searchParam) + "&" + "types=" + filterParam.join() + "&" + "page=0" + "&" + "size=10" + "&" + "sort=id,desc";
// 		getAssigments(url);
// 	}

//   async function getAssigments(url: string) {

//   }

  

//   const buttons: FunctionalIconModel[] = [];

//   function editAssignment(...data: any[]) {
// 		navigate('/admin/manage-assignments/edit', { state: { user: data[1] } })
// 	}

// 	function deleteAssignment(...data: any[]) {
// 		window.alert(data)
// 	}

//   function refreshAssignment(...data: any[]) {

//   }

// 	const editIcon: FunctionalIconModel = {
// 		icon: faPencil,
// 		style: "",
// 		onClickfunction: editAssignment
// 	};
// 	const deleteIcon: FunctionalIconModel = {
// 		icon: faCircleXmark,
// 		style: { color: 'red' },
// 		onClickfunction: deleteAssignment
// 	};

//   const refreshIcon: FunctionalIconModel = {
//     icon: faRefresh,
//     style: "",
//     onClickfunction: refreshAssignment
//   }

//   buttons.push(editIcon, deleteIcon, refreshIcon);
//   return (
//     <Container style={{ maxWidth: "100%"}} className="p-4">
//       <Row className="py-4 me-3">
// 				<Col className="d-flex justify-content-start align-items-center px-0">
// 					<DropdownFilterComponent title={"Type"} data={filterdata} params={filterParam} setParamsFunction={setFilterParam} initFunction={InitializeQuery}></DropdownFilterComponent>
// 				</Col>
//         <Col className="d-flex justify-content-end align-items-center w-25 px-0">
//             <Form.Control type="date" />
//         </Col>
// 				<Col sm={5} className="d-flex justify-content-end align-items-center ">
// 					<SearchComponent placeholder={""} url={url} params={searchParam} setParamsFunction={setSearchParam} initFunction={InitializeQuery} ></SearchComponent>
// 				</Col>
// 				<Col className="d-flex justify-content-end align-items-center w-25"   >
// 					<Button variant="danger" onClick={() => {}}>Create New Assignment</Button>
// 				</Col>
// 			</Row>

//       {loading ?
// 				<LoaderComponent></LoaderComponent>
// 				:
// 				<>
// 					{DummyData.length === 0 ?
// 						<Row>
// 							<h4 className="text-center"> No Assignment Found</h4>
// 						</Row> :
// 						<>
// 							<Row>
// 								<TableComponent 
//                 headers={header} 
//                 sortString={undefined} 
//                 setSortString={undefined} 
//                 initFunction={() => {}} 
//                 datas={DummyData} 
//                 auxData={[]} 
//                 auxHeader={[]} 
//                 buttons={buttons} 
//                 url={''} 
//                 showModalCell={[]}/>
// 							</Row>
//               <PaginationComponent currentPage={0} totalPage={10} totalElements={3} initFunction={() =>{}} setCurrentPage={0} ></PaginationComponent>
// 						</>
// 					}
// 				</>
// 			}
//     </Container>
//   )
}
