import React, { ReactNode, useEffect, useState } from 'react'
import { BreadcrumbComponent } from '../../commons/BreadcrumbComponent'
import { Col, Container, Row } from 'react-bootstrap'
import { ColorPalette } from '../../../utils/ColorPalette'
import { ConfirmModalComponent } from '../../commons/ConfirmModalComponent'
import { LoaderComponent } from '../../commons/LoaderComponent'
import { PaginationComponent } from '../../commons/PaginationComponent'
import { TableComponent } from '../../commons/TableComponent'
import { ReturningModel } from '../../../models/ReturningModel'
import { ReturningParamState, ReturningState } from '../../../utils/Enum'
import { FunctionalIconModel } from '../../../models/FunctionalIconModel'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { toDateString, uppercaseStatusToText } from '../../../utils/utils'
import useSWR from 'swr'
import { getRequestForReturningSWR, sendResponseReturningRequest } from '../../../services/ReturningService'
import { RequestPageableModel } from '../../../models/PageableModel'
import { DropdownFilterComponent } from '../../commons/DropdownFilterComponent'
import { SearchComponent } from '../../commons/SearchComponent'
import { message } from 'antd'
import { DatePickerComponent } from '../../commons/DatePickerComponent'
import { TableHeaderModel } from '../../../models/TableHeaderModel'
import { DropdownFilterModel } from '../../../models/DropdownFilterModel'

type Props = {
    setHeaderTitle: (title: ReactNode) => void
}

const header: TableHeaderModel[] = [
    { name: 'No.', value: "id", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: 'Asset Code', value: "assignment.asset.assetCode", sort: true, direction: true, colStyle: {}, isCurrentlySorted: true, style: {} },
    { name: 'Asset Name', value: "assignment.asset.name", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: 'Requested By', value: "auditMetadata.createdBy.username", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: 'Accepted By', value: "acceptedBy", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: 'Assigned Date', value: "assignment.assignedDate", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: 'Returned Date', value: "returnedDate", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
    { name: 'State', value: "status", sort: true, direction: true, colStyle: {}, isCurrentlySorted: false, style: {} },
]

let filterState:DropdownFilterModel[] = [
    { label: "Completed", value: "COMPLETED", defaultChecked: true },
    { label: "Waiting for returning", value: "WAITING_FOR_RETURNING", defaultChecked: true }
];

const modalHeader = ["No.", "Asset Code", "Asset Name", "Requested By", "Assigned Date", "Returned Date", "State"];

export const RequestReturningConponent: React.FC<Props> = (props: Props) => {
    const [auxHeader] = useState<string[]>(modalHeader);
    const [messageApi, contextHolder] = message.useMessage();
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for the Logout Modal
    const [responseData, setResponseData] = useState<{ id: number, status: boolean }>({ id: 0, status: false });
    const [param, setParam] = useState<RequestPageableModel>({
        search: "",
        states: [
            ReturningParamState[ReturningParamState.COMPLETED],
            ReturningParamState[ReturningParamState.WAITING_FOR_RETURNING]
        ],
        returnedDate: "",
        page: 0,
        size: 20,
        sort: "assignment.asset.assetCode,asc",
    });

    const handleSetParam = (
        func: (p: RequestPageableModel) => RequestPageableModel
    ) => {
        const newParam = func(param);
        if (newParam.page === param.page) {
            newParam.page = 0;
        }
        setParam(newParam);
    };

    const handleDatePicker = (_: any, dateString: string | string[]) => {
        const formattedDateString = Array.isArray(dateString) ? dateString[0] : dateString;
        return handleSetParam((p: RequestPageableModel) => ({
            ...p,
            returnedDate: formattedDateString,
        }))
    }

    const acceptReturning = (...data: ReturningModel[]) => {
        setShowConfirmModal(true);
        setResponseData({ id: data[1].id, status: true });
    }
    const declineReturning = (...data: ReturningModel[]) => {
        setShowConfirmModal(true);
        setResponseData({ id: data[1].id, status: false });
    }

    const acceptIcon: FunctionalIconModel = {
        icon: faCheck,
        style: { color: ColorPalette.PRIMARY_COLOR },
        onClickfunction: acceptReturning
    };
    const declineIcon: FunctionalIconModel = {
        icon: faXmark,
        style: { color: 'black' },
        onClickfunction: declineReturning
    };
    const buttons: FunctionalIconModel[] = [acceptIcon, declineIcon];

    const setDisableButtonState = (data: ReturningModel[]) => {
        const isEqualState = (state: string, stateEnum: ReturningState) =>
            uppercaseStatusToText(state).toLowerCase() === stateEnum.toLowerCase();
        return data.map((item: ReturningModel) => [
            isEqualState(item.state, ReturningState.COMPLETED),
            isEqualState(item.state, ReturningState.COMPLETED),
        ]);
    };

    const formatRecordList = (records: ReturningModel[]) => {
        return records.map((record: ReturningModel) => {
            return {
                id: record.id,
                assetCode: record.assetCode,
                assetName: record.assetName,
                requestedBy: record.requestedBy,
                acceptedBy: record.acceptedBy,
                assignedDate: toDateString(record.assignedDate),
                returnedDate: toDateString(record.returnedDate),
                state: uppercaseStatusToText(record.state)
            };
        });
    };

    const {
        data: returningResponse,
        isLoading: isReturningLoading,
        mutate: mutateReturning
    } = useSWR("returning/"
        + param.search
        + param.returnedDate
        + param.states.join('')
        + param.page.toString()
        + param.size.toString()
        + param.sort.toString(),
        () => { return getRequestForReturningSWR(param) },
        {
            revalidateOnFocus: false,
            onError: ((err) => message.error(err.response.data.message))
        }
    );

    useEffect(() => {
        props.setHeaderTitle(<BreadcrumbComponent breadcrumb={[
            {
                title: 'Request for Returning',
                href: `${window.location.origin}/admin/request-returning#`
            }
        ]} />);
    }, [])

    const handleModalConfirm = () => {
        setShowConfirmModal(false);
        responseReturningRequest(responseData.id, responseData.status); // Call the Confirm function
    }

    const handleModalCancel = () => {
        setShowConfirmModal(false); // Hide the Confirm Modal
    }

    const responseReturningRequest = async (id: number, status: boolean) => {
        messageApi.open({
            type: 'loading',
            content: status === true ? 'Completing returning request...' : 'Cancelling returning request...',
        })
            .then(async () => {
                await sendResponseReturningRequest(id, status)
                    .then((res: any) => {
                        if (res.status === 200) {
                            message.success(res.data.message);
                            mutateReturning();
                        }
                    })
                    .catch((err) => {
                        message.error(err.response.data.message);
                    })
            })
    }

    return (
        <Container>
            {contextHolder}
            <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className='fw-bold fs-4 ms-1 mt-5 mb-3'>Request List</h4>
            <Row className="py-4 ms-0 pe-2 user-param-row justify-content-between">
                <Col sm={7}>
                    <Row>
                        <Col sm={5} className="d-flex justify-content-start align-items-center px-2">
                            <DropdownFilterComponent
                                title={"State"}
                                data={filterState}
                                params={param.states}
                                setParamsFunction={handleSetParam}
                                style={{ width: "100%" }}
                                defaultAll={true}
                                paramName={"states"}
                            />
                        </Col>
                        <Col sm={5} className="d-flex justify-content-start align-items-center px-2">
                            <DatePickerComponent handleDatePicker={handleDatePicker} placeHolderText={'Returned Date'} />
                        </Col>
                    </Row>
                </Col>
                <Col sm={4} className="d-flex justify-content-end align-items-center">
                    <SearchComponent placeholder={"Search Asset Code, Asset Name or Requester's Username"} setParamsFunction={setParam} style={{ width: "100%" }} setDummy={() => { }} class={''}></SearchComponent>
                </Col>
            </Row>
            {isReturningLoading ?
                <LoaderComponent />
                :
                <>
                    {returningResponse?.content.length === 0 ?
                        <Row>
                            <h5 className="text-center"> No Returning Request Found</h5>
                        </Row> :
                        <>
                            <Row className='ps-2'>
                                <p className='fs-5' style={{ color: "gray" }}>
                                    Total : {returningResponse?.content.length ?? 0}
                                </p>
                            </Row>
                            <Row>
                                <TableComponent headers={header} datas={formatRecordList(returningResponse?.content!)} setSortString={setParam} auxData={returningResponse?.content!} auxHeader={auxHeader} buttons={buttons} showModalCell={[]} setDummy={() => { }} setModalData={() => { }} setModalShow={() => { }} pre_button={undefined} disableButton={setDisableButtonState(returningResponse?.content!)} />
                            </Row>
                            <PaginationComponent currentPage={param.page} totalPage={returningResponse?.totalPage!} setParamsFunction={setParam} perPage={param.size} fixPageSize={false} containerRef={undefined} />
                        </>
                    }
                </>
            }
            <ConfirmModalComponent show={showConfirmModal} onConfirm={handleModalConfirm} onCancel={handleModalCancel} confirmTitle={'Response Confirmation'} confirmQuestion={responseData.status === true ? 'Do you want to mark this returning request as \'Completed\'?' : 'Do you want to cancel this returning request?'} confirmBtnLabel={'Yes'} cancelBtnLabel={'No'} modalSize={'md'} />
        </Container>
    )
}
