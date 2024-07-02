import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { SearchComponent } from "../../commons/SearchComponent"
import { TableComponent } from "../../commons/TableComponent"
import { ColorPalette } from "../../../utils/ColorPalette"
import { LoaderComponent } from "../../commons/LoaderComponent"
import { PaginationComponent } from "../../commons/PaginationComponent"
import { useEffect, useState } from "react"
import { getAsset, getCategories } from "../../../services/AssetService"
import { AssetModel } from "../../../models/AssetModel"
import { message } from 'antd';
import { AssetForSelectTableModel } from "../../../models/AssetForSelectTableModel"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useSWR from "swr"
import { categoriesEndpoint } from "../../../services/CategoryService"
import { CategoryModel } from "../../../models/CategoryModel"

const header = [
	{ name: '', value: "", sort: false, direction: false, colStyle: { width: "20%" } },
	{ name: 'Asset Code', value: "assetCode", sort: true, direction: true, colStyle: { width: "15%" } },
	{ name: 'Asset Name', value: "assetName", sort: false, direction: true, colStyle: { width: "50%" } },
	{ name: 'Category', value: "category", sort: true, direction: true, colStyle: { width: "25%" } },

]

type Props = {
	setSelectedOnParent: any
	closeDropdown: any
}
export const SelectAssetComponent = (props: Props) => {
	const [tableAsset, setTableAsset] = useState<AssetForSelectTableModel[]>([]);

	const [auxData, setAuxData] = useState<AssetModel[]>([]);

	const [loading, setLoading] = useState(true);

	const [totalPage, setTotalPage] = useState(0);

	const [dummy, setDummy] = useState(0);

	const [, setPage] = useState(0);
	const [selected, setSelected] = useState<String>("")
	//const [categories, setCategories] = useState<number[]>([])
	

	const [param, setParam] = useState({
		search: "",
		states: ["AVAILABLE"],
		categories: [],
		page: 0,
		size: 20,
		sort: "assetCode,asc",
	});

	useSWR(
		categoriesEndpoint,
		getCategories,
		{
			onSuccess: (response) => {
				console.log(response)
				const arrayId = response.data.data.map((category: CategoryModel) => category.id)
				console.log(arrayId)
				setParam((p: any) => ({ ...p, categories: arrayId }))
				setDummy(Math.random())
			}
		}
	
	  );

	async function InitializeQuery() {
		setLoading(true)
		let params = "?"
			+ "search=" + encodeURIComponent(param.search) + "&"
			+ "states=" + param.states.join() + "&"
			+ "categories=" + param.categories.join() + "&"
			+ "page=" + param.page + "&"
			+ "size=" + "20" + "&"
			+ "sort=" + param.sort;
		console.log(params);

		setLoading(true)

		await getAsset(params).then((response) => {
			const data = response.data.data;
			setParam((p: any) => ({ ...p, page: data.currentPage }));
			let assets: AssetModel[] = data.content;
			let assetsforTable: AssetForSelectTableModel[] = assets.map(a => {
				return {
					assetCode: a.assetCode,
					assetName: a.name,
					category: a.category,
				}
			})
			setTableAsset(assetsforTable)
			setAuxData(assets);
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


	const preButton = (asset: AssetModel, setAsset: any) => {
		return (
			<Form.Check
				type={"radio"}
				name="select_user"
				onChange={() => {
					setAsset(asset)
				}}
			/>
		)
	}

	const save = () => {
		console.log(selected);
		props.setSelectedOnParent(selected);
		props.closeDropdown()
	}

	return (
		<Container>
			<Row>
				<Col>
					<h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
						Asset List
					</h4>
				</Col>
				<Col>
					<SearchComponent placeholder={""} params={param.search} setParamsFunction={setParam} setDummy={setDummy} style={{ width: "100%" }}></SearchComponent>
				</Col>
			</Row>
			<Row>
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
									<TableComponent headers={header} datas={tableAsset} auxData={auxData} auxHeader={[]} buttons={[]} setSortString={setParam} showModalCell={[]} setDummy={setDummy} setModalData={() => { }} setModalShow={undefined} pre_button={preButton} setSelect={setSelected} disableButton={[]}  ></TableComponent>
								</Row>
								<PaginationComponent currentPage={param.page} setPage={setParam} totalPage={totalPage} setDummy={setPage} perPage={0} setParamsFunction={setParam} fixPageSize={false} ></PaginationComponent>
							</>
						}
					</>
				}
			</Row>
			<Row>
				<Col className="d-flex justify-content-end my-4">
					<Button variant="danger" className="mx-4" style={{ minWidth: "100px" }} type="button" onClick={save}> {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save"}</Button>
					<Button variant="outline-dark" className="ms-4" style={{ minWidth: "100px" }} onClick={props.closeDropdown}>Cancel</Button>
				</Col>
			</Row>
		</Container>
	)
}