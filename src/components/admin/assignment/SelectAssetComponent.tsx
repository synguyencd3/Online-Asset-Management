import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { TableComponent } from "../../commons/TableComponent"
import { ColorPalette } from "../../../utils/ColorPalette"
import { LoaderComponent } from "../../commons/LoaderComponent"
import { PaginationComponent } from "../../commons/PaginationComponent"
import { useRef, useState } from "react"
import { assetFetcher, categoryFetcher, getAssetUrl, getCategoryUrl } from "../../../services/AssetService"
import { AssetModel, AssetParamModel } from "../../../models/AssetModel"
import { message } from 'antd';
import { AssetForSelectTableModel } from "../../../models/AssetModel"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CategoryModel } from "../../../models/CategoryModel"
import { DropdownSearchComponent } from "../../commons/DropDownSearchComponent"
import { TableHeaderModel } from "../../../models/TableHeaderModel"
import useSWR from "swr"

const header: TableHeaderModel[] = [
	{ name: '', value: "", sort: false, direction: false, colStyle: { width: "20%" }, isCurrentlySorted: false, style: {} },
	{ name: 'Asset Code', value: "assetCode", sort: true, direction: true, colStyle: { width: "15%" }, isCurrentlySorted: false, style: {} },
	{ name: 'Asset Name', value: "name", sort: true, direction: true, colStyle: { width: "50%" }, isCurrentlySorted: false, style: {} },
	{ name: 'Category', value: "category", sort: true, direction: true, colStyle: { width: "250px", maxWidth:"200px" }, isCurrentlySorted: false, style: {} },
]

type Props = {
	setSelectedOnParent: any
	closeDropdown: any
}
export const SelectAssetComponent = (props: Props) => {

	const [selected, setSelected] = useState<String>("")

	const containerRef = useRef(null);

	const [param, setParam] = useState<AssetParamModel>({
		search: "",
		states: ["AVAILABLE"],
		categories: undefined,
		page: 0,
		size: 20,
		sort: "assetCode,asc",
	});

	const handleSetParam = (func: (p: AssetParamModel) => AssetParamModel) => {
		console.log("sorting")
		const newParam = func(param);
		if (newParam.page === param.page) {
			newParam.page = 0;
		}
		setParam(newParam);
	};

	const { data: category, isLoading: _isLoadingCategory } = useSWR(getCategoryUrl, categoryFetcher, {
		onError: () => {
			message.error("Failed to Load Category")
		},
		revalidateOnFocus: false,
		shouldRetryOnError: false
	})

	if (param.categories === undefined && category) {
		const data = category.data.data as CategoryModel[];
		param.categories = data.map(obj => obj.id.toString())
	}

	const { data: asset, isLoading: _isLoadingAsset } = useSWR(param.categories ? getAssetUrl(param) : null, assetFetcher, {
		onError: () => {
			message.error("Failed to Load Asset")
		},
		shouldRetryOnError: false,
		revalidateOnFocus: false,
	});

	let tableAsset: AssetForSelectTableModel[] = [];
	if (asset) {
		let assets = asset.content;
		tableAsset = assets.map(a => {
			return {
				assetCode: a.assetCode,
				assetName: a.name,
				category: a.category,
			}
		})
		window.history.replaceState({}, '')
	}

	const preButton = (asset: AssetModel, setAsset: any) => {
		return (
			<Form.Check
				type={"radio"}
				name="select_asset"
				onChange={() => {
					setAsset(asset)
				}}
			/>
		)
	}

	const save = () => {
		props.setSelectedOnParent(selected);
		props.closeDropdown()
	}

	return (
		<Container ref={containerRef}>
			<Row>
				<Col>
					<h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
						Asset List
					</h4>
				</Col>
				<Col>
					<DropdownSearchComponent placeholder={"Search by name"} setParamsFunction={handleSetParam} setDummy={()=>{}} style={{ width: "100%" }}></DropdownSearchComponent>
				</Col>
			</Row>
			<Row>
				{!asset ?
					<LoaderComponent></LoaderComponent>
					:
					<>
						{tableAsset.length === 0 ?
							<Row>
								<h4 className="text-center"> No Asset Found</h4>
							</Row> :
							<>
								<Row>
									<TableComponent headers={header} datas={tableAsset} auxData={tableAsset} auxHeader={[]} buttons={[]} setSortParam={handleSetParam} showModalCell={[]} setDummy={()=>{}} setModalData={() => { }} setModalShow={undefined} pre_button={preButton} setSelect={setSelected} disableButton={[]}  ></TableComponent>
								</Row>
								<PaginationComponent currentPage={param.page} totalPage={asset.totalPage} perPage={param.size} setParamsFunction={handleSetParam} fixPageSize={false} containerRef={containerRef} ></PaginationComponent>
							</>
						}
					</>
				}
			</Row>
			<Row>
				<Col className="d-flex justify-content-end my-4">
					<Button variant="danger" className="mx-4" style={{ minWidth: "100px" }} type="button" onClick={save}> {_isLoadingAsset ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save"}</Button>
					<Button variant="outline-dark" className="ms-4" style={{ minWidth: "100px" }} onClick={props.closeDropdown}>Cancel</Button>
				</Col>
			</Row>
		</Container>
	)
}