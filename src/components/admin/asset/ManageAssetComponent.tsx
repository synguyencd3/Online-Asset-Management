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
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { CategoryModel } from '../../../models/CategoryModel';
import { deleteAsset, getAsset, getCategories } from '../../../services/AssetService';
import { AssetForTableModel, AssetModel } from '../../../models/AssetModel';
import { AssetModalComponent } from './AssetModalComponent';
import { ConfirmModalComponent } from '../../commons/ConfirmModalComponent';

const header = [{ name: 'Asset Code', value: "assetCode", sort: true, direction: true, colStyle: { width: "12%" } }, { name: 'Asset Name', value: "name", sort: true, direction: true, colStyle: { width: "40%" } }, { name: 'Category', value: "category.name", sort: true, direction: true, colStyle: { maxWidth: '200px' } }, { name: 'State', value: "status", sort: true, direction: true, colStyle: { width: "15%" } }]
const showModalCell = ["assetCode", "assetName"]
const modalHeader = ["Asset Code", "Asset Name", "Category", "Installed Date", "State", "Location", "Specification"]

type Props = {
	setHeaderTitle: any
}

export const ManageAssetComponent: React.FC<Props> = (props: Props) => {
	const navigate = useNavigate();

	// const [messageApi, contextHolder] = message.useMessage();
	const [tableAsset, setTableAsset] = useState<AssetForTableModel[]>([]);
	const [auxData, setAuxData] = useState<AssetModel[]>([]);

	const [category, setCategory] = useState<CategoryModel[]>();

	const [loading, setLoading] = useState(true);

	const [_showDisableModal, setShowDisableModal] = useState(false);

	const [_deleteAssetCode, setDeleteAssetCode] = useState('');
	useEffect(() => {
		props.setHeaderTitle("Manage Asset");
	}, [])

	const [param, setParam] = useState({
		search: "",
		states: ["ASSIGNED", "AVAILABLE", "NOT_AVAILABLE"],
		categories: [""],
		page: 0,
		size: 20,
		sort: "assetCode,asc",
	});

	const isFirstLoad = useRef(true);
	const [dummy, setDummy] = useState(0);
	const [page, setPage] = useState(0);

	const [totalPage, setTotalPage] = useState(0);
	const [totalElement, setTotalElement] = useState(0);

	const location = useLocation();

	const [newAsset] = useState<AssetModel>(location.state?.newAsset);
	// const [newAsset] = useState<AssetForTableModel>(location.state?.newAsset);

	const [modalShow, setModalShow] = useState(false);

	const [modalData, setModalData] = useState<AssetModel>();

	modalShow ? modalData ? "" : "" : "";

	useEffect(() => {
		if (isFirstLoad.current) {
			isFirstLoad.current = false;
			getCategory()
		}
	}, [])

	useEffect(() => {
		if (category != undefined) {
			param.page = 0
			InitializeQuery();
		}
	}, [dummy])

	useEffect(() => {
		if (category != undefined) {
			InitializeQuery()
		}
	}, [page])

	async function getCategory() {
		await getCategories().then((response) => {
			const data: CategoryModel[] = response.data.data;
			setCategory(data);
			setParam(p => ({ ...p, categories: data.map(obj => obj.id.toString()) }));
			setDummy(Math.random())
		}).catch(e => {
			message.error(e.message);
		});
	}

	async function InitializeQuery() {
		setLoading(true)
		let params = "?"
			+ "search=" + encodeURIComponent(param.search) + "&"
			+ "states=" + param.states.join() + "&"
			+ "categories=" + param.categories.join() + "&"
			+ "page=" + param.page + "&"
			+ "size=" + param.size + "&"
			+ "sort=" + param.sort;
		// console.log(params);
		await getAsset(params).then((response) => {
			const data = response.data.data;
			setParam((p: any) => ({ ...p, page: data.currentPage }));
			let assets: AssetModel[] = data.content;
			assets = assets.map(a => {
				return {
					assetCode: a.assetCode,
					name: a.name,
					category: a.category,
					installedDate: a.installedDate,
					state: a.state,
					location: a.location,
					specification: a.specification,
				}
			})
			let assetsforTable: AssetForTableModel[] = assets.map(a => {
				return {
					assetCode: a.assetCode,
					assetName: a.name,
					category: a.category,
					state: a.state.charAt(0) + a.state.replace(/_/g, " ").slice(1).toLowerCase()
				}
			})
			if (newAsset) {
				assets = [newAsset, ...assets.filter(a => a.assetCode !== newAsset.assetCode)];
				assetsforTable = [{
					assetCode: newAsset.assetCode,
					assetName: newAsset.name,
					category: newAsset.category,
					state: newAsset.state.charAt(0) + newAsset.state.replace(/_/g, " ").slice(1).toLowerCase()
				}, ...assetsforTable.filter(a => a.assetCode !== newAsset.assetCode)]
			}
			setTableAsset(assetsforTable)
			setAuxData(assets);
			setTotalPage(data.totalPage);
			setTotalElement(data.totalElements)

		}).catch(e => {
			message.error(e.message);
		})
		setLoading(false);
		window.history.replaceState({}, '')
	}

	// button
	const buttons: FunctionalIconModel[] = [];

	function editAsset(...data: any[]) {
		navigate('/admin/manage-assets/edit', { state: { assetProps: data[1] } })
	}

	const handleDelete = async (assetCode: string) => {
		message.open({
			type: 'loading',
			content: 'Deleting asset...',
		})
			.then(async () => {
				await deleteAsset(assetCode)
					.then((res) => {
						if (res.status == 204) {
							message.success("Asset deleted successfully");
							setDummy(Math.random());
						}
					})
					.catch((err) => {
						message.error(`${err.response.data.message}`);
					});
			});
	}

	const handleDeleteConfirm = () => {
		setShowDisableModal(false);
		handleDelete(_deleteAssetCode); // Call the Disable function
	}

	const handleDeleteCancel = () => {
		setShowDisableModal(false);
		setDeleteAssetCode('') // Hide the Disable Modal
	}

	const handleDeleteClick = (staffCode: string) => {
		setShowDisableModal(true)
		setDeleteAssetCode(staffCode); // Show the Disable Modal
	}

	function openModal(...data: any[]) {
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
	category ? category.forEach(c => { filterCategory.push({ label: c.name, value: c.id.toString(), defaultChecked: true }) }) : "";

	//----------------------------

	//---------------------
	let disableButtonArray: boolean[][] = tableAsset.map(a => { return a.state === "Assigned" ? [true, true] : [false, false] });
	///////////////////////

	return (
		<Container style={{ maxWidth: "100%" }} className="p-4">
			{/* {contextHolder} */}
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
							<Row className='ps-2'>
								<p className='fs-5' style={{ color: "gray" }}>
									Total : {totalElement}
								</p>
							</Row>
							<Row>
								<TableComponent headers={header} datas={tableAsset} auxData={auxData} auxHeader={modalHeader} buttons={buttons} setSortString={setParam} showModalCell={showModalCell} setDummy={setDummy} setModalData={setModalData} setModalShow={setModalShow} pre_button={undefined} disableButton={disableButtonArray}  ></TableComponent>
							</Row>
							<PaginationComponent currentPage={param.page} setParamsFunction={setParam} totalPage={totalPage} setDummy={setDummy} setPage={setPage} perPage={param.size} fixPageSize={false} ></PaginationComponent>
						</>
					}
				</>
			}

			<AssetModalComponent
				title={"Detailed Asset Information"}
				show={modalShow}
				onHide={() => setModalShow(false)}
				data={modalData?.assetCode}
			/>
			<ConfirmModalComponent show={_showDisableModal} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} confirmTitle={'Are you sure?'} confirmQuestion={'Do you want to delete this asset?'} confirmBtnLabel={'Delete'} cancelBtnLabel={'Cancel'} modalSize={"md"} />
		</Container>
	);
}

