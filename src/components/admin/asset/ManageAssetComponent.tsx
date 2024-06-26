import { message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react'
import { FunctionalIconModel } from '../../../models/FunctionalIconModel';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { DropdownFilterComponent } from '../../commons/DropdownFilterComponent';
import { SearchComponent } from '../../commons/SearchComponent';
import { LoaderComponent } from '../../commons/LoaderComponent';
import { TableComponent } from '../../commons/TableComponent';
import { PaginationComponent } from '../../commons/PaginationComponent';
import { AssetForTableModel } from '../../../models/AssetForTableModel';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { CategoryModel } from '../../../models/CategoryModel';
import { getAsset, getCategories } from '../../../services/AssetService';
import { UserInfoModalComponent } from '../../commons/UserInfoModalComponent';
import { AssetModel } from '../../../models/AssetModel';



const header = [{ name: 'Asset Code', value: "assetCode", sort: true, direction: true, colStyle: { width: "12%" } }, { name: 'Asset Name', value: "assetName", sort: true, direction: true, colStyle: { width: "40%" } }, { name: 'Category', value: "category", sort: false, direction: true, colStyle: {} }, { name: 'State', value: "state", sort: true, direction: true, colStyle: { width: "15%" } }]
const showModalCell = ["assetCode", "assetName"]
const modalHeader = ["Staff Code", "Full Name", "Username", "Date of Birth", "Gender", "Joined Date", "Type", "Location"]


export const ManageAssetComponent: React.FC = () => {
	const navigate = useNavigate();

	// const [modalUsers, setModalUsers] = useState<ModalUserModel[]>([]);

	const [tableAsset, setTableAsset] = useState<AssetForTableModel[]>([]);

	const [category, setCategory] = useState<CategoryModel[]>([]);

	const [loading, setLoading] = useState(true);

	const [_showDisableModal, setShowDisableModal] = useState(false);

	const [_deleteAssetCode, setDeleteAssetCode] = useState('');
	const isInitialRender = useRef(0);

	// two for each useEffect when useStrictApp, the first useEffect declare that check isInitialRender will be the one that run ??? // need check
	const totalFirstLoad = 4;

	const [param, setParam] = useState({
		search: "",
		states: ["ASSIGNED", "AVAILABLE", "NOT_AVAILABLE"],
		categories: [""],
		page: 0,
		size: 20,
		sort: "assetCode,asc",
	});

	const [dummy, setDummy] = useState(0);
	const [page, setPage] = useState(0);
	const [totalPage, setTotalPage] = useState(0);

	const location = useLocation();

	const [newAsset] = useState<AssetForTableModel>(location.state?.newAsset);

	const [modalShow, setModalShow] = useState(false);

	const [modalData, setModalData] = useState<Object>({});

	modalShow ? modalData ? "" : "" : "";

	useEffect(() => {
		if (isInitialRender.current < 1) {
			return;
		}
		getCategory()
	}, [])

	useEffect(() => {
		if (isInitialRender.current < totalFirstLoad) {
			isInitialRender.current++;
			return;
		}
		param.page = 0
		InitializeQuery()
	}, [dummy])

	useEffect(() => {
		if (isInitialRender.current < totalFirstLoad) {
			isInitialRender.current++;
			return;
		}
		else {
			InitializeQuery()
		}
	}, [page])

	async function getCategory() {
		let a = await getCategories().then((response) => {
			const data: CategoryModel[] = response.data.data;
			setCategory(data);
			setParam(p => ({ ...p, categories: data.map(obj => obj.id.toString()) }));
			setDummy(Math.random())
			return data.map(obj => obj.id.toString());
		}).catch(e => {
			message.error(e.message);
		});
		return a;
	}

	async function InitializeQuery() {
		setLoading(true)
		let params = "?"
			+ "search=" + encodeURIComponent(param.search) + "&"
			+ "states=" + param.states.join() + "&"
			+ "categories=" + param.categories.join() + "&"
			+ "page=" + param.page + "&"
			+ "size=" + "20" + "&"
			+ "sort=" + param.sort;

		setLoading(true)

		await getAsset(params).then((response) => {
			const data = response.data.data;
			setParam((p: any) => ({ ...p, page: data.currentPage }));
			let assets: AssetForTableModel[] = data.content;
			assets.forEach(e => { e.state = e.state.charAt(0) + e.state.replace(/_/g, " ").slice(1).toLowerCase() })
      let assetTable : AssetForTableModel[] = [];
      if (newAsset) {
        assetTable.push(newAsset);
        newAsset.state = newAsset.state.charAt(0) + newAsset.state.replace(/_/g, " ").slice(1).toLowerCase()
        assets.forEach(e => {
          if (e.assetCode !== newAsset.assetCode) {
            assetTable.push(e);
          }
        });
        setTableAsset(assetTable);
      }
      else {
        setTableAsset(data.content)
      }

			setTotalPage(data.totalPage);
		}).catch(e => {
			message.error(e.message);
		});
		setLoading(false);
		// window.history.replaceState({}, '')
	}

	// button
	const buttons: FunctionalIconModel[] = [];

	function editAsset(...data: any[]) {
		navigate('/admin/manage-assets/edit', { state: { assetProps: data[1] } })
	}

	// const handleDelete = async (assetCode: string) => {
	// 	message.open({
	// 		type: 'loading',
	// 		content: 'Deleting asset...',
	// 	})
	// 		.then(async () => {
	// 			console.log(import.meta.env.VITE_AZURE_BACKEND_DOMAIN);
	// 			await deleteAsset(assetCode)
	// 				.then((res) => {
	// 					console.log(res);
	// 					if (res.status == 200) {
	// 						console.log(res.data);
	// 						message.success(res.data.message);
	// 						setDummy(Math.random());
	// 					}
	// 				})
	// 				.catch((err) => {
	// 					console.log(err.response);
	// 					console.log(process.env.REACT_APP_AZURE_BACKEND_DOMAIN);
	// 					// const errorData = err.response.data.substring(0, err.response.data.indexOf('}') + 1);
	// 					// const errorResponse: ErrorResponse = JSON.parse(errorData);
	// 					message.error(`${err.response.message}`);
	// 				});
	// 		});
	// }

	//   const handleDeleteConfirm = () => {
	// 		setShowDisableModal(false);
	// 		handleDelete(deleteAssetCode); // Call the Disable function
	// 	}

	//   const handleDeleteCancel = () => {
	// 		setShowDisableModal(false);
	// 		setDeleteAssetCode('') // Hide the Disable Modal
	// 	}
		setShowDisableModal(true)
		setDeleteAssetCode(staffCode); // Show the Disable Modal
	}

  function openModal(...data: any[]) {
    console.log(data[1]);
		handleDeleteClick(data[1].assetCode);
  }

	const editIcon: FunctionalIconModel = {
		icon: faPencil,
		style: "",
		onClickfunction: editAsset
	};
	const deleteIcon: FunctionalIconModel = {
		icon: faCircleXmark,
		style: { color: 'red' },
		onClickfunction: openModal
	};

	buttons.push(editIcon, deleteIcon);

	//--------------------------- 

	// Dropdown Filter
	let filterState = [];
	let state1 = { label: "Assigned", value: "ASSIGNED", defaultChecked: true }
	let state2 = { label: "Available", value: "AVAILABLE", defaultChecked: true }
	let state3 = { label: "Not available", value: "NOT_AVAILABLE", defaultChecked: true }
	let state4 = { label: "Waiting for recyling", value: "WAITING_FOR_RECYCLING", defaultChecked: false }
	let state5 = { label: "Recycled", value: "RECYCLED", defaultChecked: false }
	filterState.push(state1, state2, state3, state4, state5);

	let filterCategory: { label: string; value: string; defaultChecked: boolean; }[] = [];
	category.forEach(c => { filterCategory.push({ label: c.name, value: c.id.toString(), defaultChecked: true }) });

	//----------------------------

	return (
		<Container style={{ maxWidth: "100%" }} className="p-4">
			<h4 className="ms-1" style={{ color: "red", fontWeight: "bold" }}>
				Asset List
			</h4>
			<Row className="py-4 ms-0 pe-2 user-param-row">
				<Col sm={3} className="d-flex justify-content-start align-items-center px-2">
					<DropdownFilterComponent title={"State"} data={filterState} params={param.states} setParamsFunction={setParam} setDummy={setDummy} style={{ width: "100%" }} defaultAll={false} paramName={'states'} ></DropdownFilterComponent>
				</Col>
				<Col sm={3} className="d-flex justify-content-start align-items-center px-2">
					<DropdownFilterComponent title={"Category"} data={filterCategory} params={param.categories} setParamsFunction={setParam} setDummy={setDummy} style={{ width: "100%" }} defaultAll={true} paramName={'categories'}></DropdownFilterComponent>
				</Col>
				<Col className="d-flex justify-content-end align-items-center">
					<SearchComponent placeholder={""} params={param.search} setParamsFunction={setParam} setDummy={setDummy} style={{ width: "100%" }}></SearchComponent>
				</Col>
				<Col sm={3} className="d-flex justify-content-end align-items-center" style={{ maxWidth: "230px" }}>
					<Button variant="danger" onClick={() => { return navigate('./new') }} style={{ width: "230px" }}>Create New Asset</Button>
				</Col>
			</Row>
			{loading ?
				<LoaderComponent></LoaderComponent>
				:
				<>
					{tableAsset.length === 0 ?
						<Row>
							<h4 className="text-center"> No Asset Found</h4>
						</Row> :
						<>
							<Row>
								{/* this initfucntion */}
								<TableComponent headers={header} datas={tableAsset} auxData={tableAsset} auxHeader={modalHeader} buttons={buttons} setSortString={setParam} showModalCell={showModalCell} setDummy={setDummy} setModalData={setModalData} setModalShow={setModalShow} pre_button={undefined}  ></TableComponent>
							</Row>
							<PaginationComponent currentPage={param.page} setCurrentPage={setParam} totalPage={totalPage} setDummy={setPage} ></PaginationComponent>
						</>
					}
				</>
			}
			{/* <UserInfoModalComponent
        title={"Detailed User Infomation"}
        show={modalShow}
        onHide={() => setModalShow(false)}
        label={modalHeader}
        data={modalData}
      /> */}
			<ConfirmModalComponent show={showDisableModal} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} confirmTitle={'Are you sure?'} confirmQuestion={'Do you want to delete this asset?'} confirmBtnLabel={'Delete'} cancelBtnLabel={'Cancel'} modalSize={"md"} /> 
		</Container>
	);
}
