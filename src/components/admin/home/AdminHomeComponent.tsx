import React, { useEffect, useState } from 'react';
import { PasswordModalComponent } from '../../auth/PasswordModalComponent';
import { TableComponent } from '../../commons/TableComponent';
import { DetailModalComponent } from '../../commons/DetailModalComponent';
import { FunctionalIconModel } from '../../../models/FunctionalIconModel';
import { AssignmentHomeViewModel, AssignmentModel } from '../../../models/AssignmentModel';
import { faCheck, faRotateBack, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ColorPalette } from '../../../utils/ColorPalette';
import { getOwnAssignmentDetails } from '../../../services/AssignmentService';
import { AssignmentState } from '../../../utils/Enum';
import { OwnPageableModel } from '../../../models/PageableModel';
import { PaginationComponent } from '../../commons/PaginationComponent';
import { Row } from 'react-bootstrap';
import { LoaderComponent } from '../../commons/LoaderComponent';

type Props = {
    setHeaderTitle: any
}

const header = [
    { name: 'Asset Code', value: "assetcode", sort: true, direction: true, colStyle: {} },
    { name: 'Asset Name', value: "assetname", sort: true, direction: true, colStyle: {} },
    { name: 'Category', value: "category", sort: true, direction: true, colStyle: {} },
    { name: 'Assigned Date', value: "assigneddate", sort: true, direction: true, colStyle: {} },
    { name: 'State', value: "state", sort: true, direction: true, colStyle: {} },
    { name: '', value: "", sort: true, direction: true, colStyle: {} },
]
const showModalCell = ["assetcode", "assetname", "category", "assigneddate", "state"];
const modalHeader = ["Asset Code", "Asset Name", "Category", "Specification", "Assigned to", "Assigned by", "Assigned Date", "State", "Note"];

export const AdminHomeComponent: React.FC<Props> = (props: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [modalDetailShow, setModalDetailShow] = useState(false);
    const [firstLogin, setFirstLogin] = useState<boolean>(false);
    const [modalData, setModalData] = useState<Object>({});
    const [data, setData] = useState<AssignmentHomeViewModel[]>([]);
    const [auxData, setAuxData] = useState<AssignmentModel[]>([]);
    const [auxHeader] = useState<string[]>(modalHeader);
    const [disableButton, setDisableButton] = useState<boolean[][]>([])
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const [param, setParam] = useState({
        search: "",
        states: ["ASSIGNED", "AVAILABLE", "NOT_AVAILABLE"],
        page: 0,
        size: 20,
        sort: "assetcode,asc",
    });


    const acceptAssignment = () => {
        window.alert("Accept Assignment");
    }
    const declineAssignment = () => {
        window.alert("Decline Assignment");
    }
    const returnAsset = () => {
        window.alert("Return Asset");
    }

    const acceptIcon: FunctionalIconModel = {
        icon: faCheck,
        style: { color: ColorPalette.PRIMARY_COLOR },
        onClickfunction: acceptAssignment
    };
    const declineIcon: FunctionalIconModel = {
        icon: faXmark,
        style: { color: 'black' },
        onClickfunction: declineAssignment
    };
    const returnIcon: FunctionalIconModel = {
        icon: faRotateBack,
        style: { color: 'blue', rotate: '70deg' },
        onClickfunction: returnAsset
    };
    const buttons: FunctionalIconModel[] = [acceptIcon, declineIcon, returnIcon];

    useEffect(() => {
        props.setHeaderTitle('Home');
        const isLoggedInFirst = sessionStorage.getItem('isFirstLogin') ? sessionStorage.getItem('isFirstLogin') : 'true';
        if (isLoggedInFirst === 'true') {
            setShowModal(false);
            setFirstLogin(false);
        } else {
            setShowModal(true);
        }
        getAssignmentData();
    }, []);

    useEffect(() => {
        getAssignmentData();
    }, [page])

    const getAssignmentData = async () => {
        setLoading(true)

        const pageable: OwnPageableModel = {
            page: param.page,
            size: param.size,
            sort: param.sort
        }
        await getOwnAssignmentDetails(pageable)
            .then((res: any) => {
                if (res.status === 200) {
                    setAuxData(res.data.data.content)
                    console.log("res.content", res.data.data.content)
                    console.log("res.totalPage", res.data.data.totalPage)
                    setData(res.data.data.content.map((data: AssignmentHomeViewModel) => ({
                        assetCode: data.assetCode,
                        assetName: data.assetName,
                        category: data.category,
                        assignedDate: data.assignedDate,
                        state: AssignmentState[data.status as unknown as keyof typeof AssignmentState],
                    })));
                    const tableData: AssignmentHomeViewModel[] = [];
                    const disableBtns: boolean[][] = [];
                    res.data.data.content.map((data: AssignmentHomeViewModel) => {
                        tableData.push({
                            assetCode: data.assetCode,
                            assetName: data.assetName,
                            category: data.category,
                            assignedDate: data.assignedDate,
                            status: AssignmentState[data.status as unknown as keyof typeof AssignmentState],
                        });
                        data.status.toString() == "WAITING_FOR_ACCEPTANCE" ? disableBtns.push([false, false, true]) : disableBtns.push([true, true, false]);

                    })
                    setData(tableData);
                    setDisableButton(disableBtns);
                    setTotalPage(res.data.data.totalPage)
                    setParam((p: any) => ({ ...p, page: res.data.data.currentPage }));
                    console.log("res.data", res.data.data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div>
            <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className='fw-bold fs-4 ms-1 mt-5 mb-3'>My Assignment</h4>
            <DetailModalComponent
                title={"Detailed Assignment Information"}
                show={modalDetailShow}
                onHide={() => setModalDetailShow(false)}
                label={modalHeader}
                data={modalData}
            />
            {loading ?
                <LoaderComponent></LoaderComponent>
                :
                <>
                    {data.length === 0 ?
                        <Row>
                            <h5 className="text-center"> No Assignment Found</h5>
                        </Row> :
                        <>
                            <Row>
                                <TableComponent headers={header} datas={data} setSortString={setParam} auxData={auxData} auxHeader={auxHeader} buttons={buttons} showModalCell={showModalCell} setDummy={undefined} setModalData={setModalData} setModalShow={setModalDetailShow} pre_button={undefined} disableButton={disableButton} />
                            </Row>
                            <PaginationComponent currentPage={param.page} totalPage={totalPage} setParamsFunction={setParam} setDummy={setPage} perPage={param.size} setPage={setPage} fixPageSize={false} />
                        </>
                    }
                </>
            }
            <PasswordModalComponent show={showModal} onClose={handleClose} isFirstLoggedIn={firstLogin} />
        </div>
    );
};
