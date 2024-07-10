import { Button, Col, Container, Form, Dropdown, InputGroup, Row } from "react-bootstrap"
import * as Yup from "yup";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectUserComponent } from "./SelectUserComponent";
import { SelectAssetComponent } from "./SelectAssetComponent";
import { ColorPalette } from "../../../utils/ColorPalette";
import { AssignmentEditModel, AssignmentModalModel } from "../../../models/AssignmentModel";
import { editAssignments, getOneAssignemnt, getOneAssignmentUrl } from "../../../services/AssignmentService";
import useSWR from "swr";
import { LoaderComponent } from "../../commons/LoaderComponent";
import { message } from "antd";
import { UserForTableModel } from "../../../models/UserModel";
import { AssetForTableModel } from "../../../models/AssetModel";
import { BreadcrumbComponent } from "../../commons/BreadcrumbComponent";



type Props = {
    setHeaderTitle: (title: ReactNode) => void
}

export const EditAssignmentComponent = (props: Props) => {
    const location = useLocation();
    const [assignmentId] = useState<number>(location.state.user);
    let navigate = useNavigate();
    let [loading, setLoading] = useState(false)
    let [selectedAsset, setSelectedAsset] = useState<AssetForTableModel>();
    let [selectedUser, setSelectedUser] = useState<UserForTableModel>();
    const [showDropdownUser, setShowDropdownUser] = useState(false);
    const [showDropdownAsset, setShowDropdownAsset] = useState(false);

    const toggleDropdownUser = () => {
        setShowDropdownUser(!showDropdownUser);
    };


    const toggleDropdownAsset = () => {
        setShowDropdownAsset(!showDropdownAsset);
    };

    const closeDropdownUser = () => {
        setShowDropdownUser(false);
    };

    const closeDropdownAsset = () => {
        setShowDropdownAsset(false);
    };

    const validationSchema = Yup.object({
        note: Yup.string().max(300, "Maximum length is 300"),
    });

    const { data: assignmentResponse, } = useSWR<AssignmentModalModel>(
        getOneAssignmentUrl(assignmentId),
        getOneAssignemnt,
    );

    const formik = useFormik({
        initialValues: {
            user: "*",
            asset: "*",
            assignedDate: "",
            note: assignmentResponse?.note ?? ""
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const data: AssignmentEditModel = {
                username: selectedUser?.username ?? (assignmentResponse?.assignedTo ?? ""),
                assetCode: selectedAsset?.assetCode ?? (assignmentResponse?.assetCode ?? ""),
                note: values?.note ?? (assignmentResponse?.note ?? "")
            };

            await editAssignments(data, assignmentId)
                .then((response) => {
                    message.success(response.data.message);
                    setLoading(false);
                    navigate("/admin/manage-assignments");
                })
                .catch((error) => {
                    message.error(error.response ? error.response.data.message : "Failed to Edit Assignment");
                    setLoading(false);
                });
        },
    });

    useEffect(() => {
        props.setHeaderTitle(<BreadcrumbComponent breadcrumb={[
            {
                title: 'Manage Assignment',
                href: `${window.location.origin}/admin/manage-assignments#`
            },
            {
                title: "Edit Assignment",
                href: `${window.location.origin}/admin/manage-assignments/edit#`
            }
        ]} />);
    }, [])


    const { getFieldProps } = formik;


    return (
        <Container>
            <Form className="p-5" style={{ maxWidth: "60%", minWidth: "300px", textAlign: "left" }} onSubmit={formik.handleSubmit}>
                <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
                    Edit Assignment
                </h4>
                {!assignmentResponse ? (
                    <LoaderComponent />
                ) : (<>
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label id="user_field" column sm={3} >
                            User
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Dropdown show={showDropdownUser} onToggle={toggleDropdownUser}>
                                <Dropdown.Toggle className="form-control p-0 m-0" variant={'light'}>
                                    <InputGroup >
                                        <Form.Control
                                            id="user_field"
                                            type='text'
                                            {...getFieldProps('user')}
                                            value={selectedUser == null ? assignmentResponse.assignedTo : selectedUser?.fullName}
                                            className="form-control border-0"
                                        />
                                        <InputGroup.Text className='bg-transparent border-0'>
                                            <FontAwesomeIcon name="search" icon={faSearch} ></FontAwesomeIcon>
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Dropdown.Toggle>
                                <Dropdown.Menu popperConfig={{
                                    strategy: "absolute",
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -40],
                                            },
                                        },
                                    ],
                                }} style={{ width: "200%" }}>
                                    <SelectUserComponent setSelectedOnParent={setSelectedUser} closeDropdown={closeDropdownUser} />
                                </Dropdown.Menu>
                            </Dropdown>
                            {formik.touched.user && formik.errors.user ? (
                                <div className="error-message">{formik.errors.user}</div>
                            ) : null}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label id="asset_label" column sm={3}>
                            Asset
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Dropdown show={showDropdownAsset} onToggle={toggleDropdownAsset}>
                                <Dropdown.Toggle className="form-control p-0 m-0" variant={'light'}>
                                    <InputGroup>
                                        <Form.Control
                                            id="asset_field"
                                            type='text'
                                            {...getFieldProps('asset')}
                                            value={selectedAsset == null ? assignmentResponse.assetName : selectedAsset?.assetName}
                                            className="form-control border-0"
                                        />
                                        <InputGroup.Text className='bg-transparent border-0'>
                                            <FontAwesomeIcon name="search" icon={faSearch} ></FontAwesomeIcon>
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Dropdown.Toggle>
                                <Dropdown.Menu popperConfig={{
                                    strategy: "absolute",
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -40],
                                            },
                                        },
                                    ],
                                }} style={{ width: "200%" }}>
                                    <SelectAssetComponent setSelectedOnParent={setSelectedAsset} closeDropdown={closeDropdownAsset} />
                                </Dropdown.Menu>
                            </Dropdown>
                            {formik.touched.asset && formik.errors.asset ? (
                                <div className="error-message">{formik.errors.asset}</div>
                            ) : null}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label id="assignedDate_label" column sm={3}>
                            Assigned Date
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control id="assignedDate_field" type="date" value={assignmentResponse.assignedDate} disabled={true} />
                        </Col>

                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label id="note_label" column sm={3}>
                            Note
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control id="note_field" as="textarea" {...getFieldProps('note')}  />
                            {formik.touched.note && formik.errors.note ? (
                                <div className="error-message">{formik.errors.note}</div>
                            ) : null}
                        </Col>
                    </Form.Group>

                    <Row>
                        <Col className="d-flex justify-content-end my-4">
                            <Button id="save" variant="danger" className="mx-4" style={{ minWidth: "100px" }} type="submit" disabled={!formik.isValid || loading}> {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save"}</Button>
                            <Button id="cancel" variant="outline-dark" className="ms-4" style={{ minWidth: "100px" }} onClick={() => { navigate(-1) }}>Cancel</Button>
                        </Col>
                    </Row>
                </>
                )}
            </Form>
        </Container >
    )
}