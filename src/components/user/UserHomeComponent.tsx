import React, { useEffect, useState } from 'react';
import { faCheck, faRotateBack, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AssignmentHomeViewModel, AssignmentModel } from '../../models/AssignmentModel';
import { FunctionalIconModel } from '../../models/FunctionalIconModel';
import { getAssignmentsDetails } from '../../services/AssignmentService';
import { ColorPalette } from '../../utils/ColorPalette';
import { AssignmentState } from '../../utils/Enum';
import { PasswordModalComponent } from '../auth/PasswordModalComponent';
import { DetailModalComponent } from '../commons/DetailModalComponent';
import { TableComponent } from '../commons/TableComponent';

type Props = {
    setHeaderTitle: any
}

const header = [
    { name: 'Asset Code', value: "assetCode", sort: true, direction: true, colStyle: {} },
    { name: 'Asset Name', value: "assetName", sort: true, direction: true, colStyle: {} },
    { name: 'Category', value: "category", sort: true, direction: true, colStyle: {} },
    { name: 'Assigned Date', value: "assignedDate", sort: true, direction: true, colStyle: {} },
    { name: 'State', value: "state", sort: true, direction: true, colStyle: {} },
    { name: '', value: "", sort: true, direction: true, colStyle: {} },
]
const showModalCell = ["assetCode", "assetName", "category", "assignedDate", "state"];
const modalHeader = ["Asset Code", "Asset Name", "Category", "Specification", "Assigned to", "Assigned by", "Assigned Date", "State", "Note"];

export const UserHomeComponent: React.FC<Props> = (props: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [modalDetailShow, setModalDetailShow] = useState(false);
    const [firstLogin, setFirstLogin] = useState<boolean>(false);
    const [modalData, setModalData] = useState<Object>({});
    const [data, setData] = useState<AssignmentHomeViewModel[]>([]);
    const [auxData, setAuxData] = useState<AssignmentModel[]>([]);
    const [auxHeader] = useState<string[]>(modalHeader);
    const [disableButton, setDisableButton] = useState<boolean[][]>([])



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

    const getAssignmentData = async () => {
        await getAssignmentsDetails()
            .then((res) => {
                if (res.status === 200) {
                    setAuxData(res.data.data)
                    console.log("res.data", res.data.data)
                    setData(res.data.data.map((data: AssignmentHomeViewModel) => ({
                        assetCode: data.assetCode,
                        assetName: data.assetName,
                        category: data.category,
                        assignedDate: data.assignedDate,
                        state: AssignmentState[data.status as unknown as keyof typeof AssignmentState],
                    })));
                    const tableData: AssignmentHomeViewModel[] = [];
                    const disableBtns: boolean[][] = [];
                    res.data.data.map((data: AssignmentHomeViewModel) => {
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
                    console.log("res.data", res.data.data)
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
            <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className='fw-bold fs-4 ms-3 mt-5 mb-3'>My Assignment</h4>
            <TableComponent headers={header} datas={data} setSortString={undefined} auxData={auxData} auxHeader={auxHeader} buttons={buttons} showModalCell={showModalCell} setDummy={undefined} setModalData={setModalData} setModalShow={setModalDetailShow} pre_button={undefined} disableButton={disableButton} />
            <DetailModalComponent
                title={"Detailed Assignment Infomation"}
                show={modalDetailShow}
                onHide={() => setModalDetailShow(false)}
                label={modalHeader}
                data={modalData}
            />
            <PasswordModalComponent show={showModal} onClose={handleClose} isFirstLoggedIn={firstLogin} />
        </div>
    );
};