import { Button, Col, Container, Form, Dropdown, InputGroup, Row } from "react-bootstrap"
import * as Yup from "yup";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectUserComponent } from "./SelectUserComponent";
import { SelectAssetComponent } from "./SelectAssetComponent";
import { ColorPalette } from "../../../utils/ColorPalette";
import {  AssignmentEditModel, AssignmentModalModel } from "../../../models/AssignmentModel";
import { editAssignments, getOneAssignemnt, getOneAssignmentUrl } from "../../../services/AssignmentService";
import useSWR from "swr";
import { LoaderComponent } from "../../commons/LoaderComponent";
import { message } from "antd";
import { UserForTableModel } from "../../../models/UserForTableModel";
import { AssetForTableModel } from "../../../models/AssetModel";
//import { editAssignments } from "../../../services/AssignmentService";
//import { message } from "antd";


type Props = {
    setHeaderTitle: any
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
       
    });

    const formik = useFormik({
        initialValues: {
            user: "*",
            asset: "*",
            assignedDate: "",
            note: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) =>{
            setLoading(true);
            const data: AssignmentEditModel = {
                username: selectedUser?.username ?? (assignmentResponse?.assignedTo ?? "") ,
                assetCode: selectedAsset?.assetCode ?? (assignmentResponse?.assetCode ?? ""),
                note: values.note ?? assignmentResponse?.note
            };

            await editAssignments(data, assignmentId)
                .then((response) => {
                    message.success(response.data.message);
                    //const newAssignment: AssignmentForTableModel = response.data.data;
                    setLoading(false);
                    navigate("/admin/manage-assignments");
                })
                .catch((error) => {
                    message.error(error.response.data.message);
                    setLoading(false);
                });
        },
    });

    useEffect(() => {
        props.setHeaderTitle("Manage Assignments > Edit Assignment");
    }, [])


    const { getFieldProps } = formik;

    const { data: assignmentResponse, } = useSWR<AssignmentModalModel>(
        getOneAssignmentUrl(assignmentId),
        getOneAssignemnt,
    );



    useEffect(() => {
    }, [selectedUser, selectedAsset])

    return (<>
        <Container>
            <Form className="p-5" style={{ maxWidth: "60%", minWidth: "300px", textAlign: "left" }} onSubmit={formik.handleSubmit}>
                <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
                    Edit Assignment
                </h4>
                {!assignmentResponse ? (
          <LoaderComponent />
        ) : (<>
                <Form.Group as={Row} className="mb-3" >
                    <Form.Label column sm={3} >
                        User
                        <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                        <Dropdown show={showDropdownUser} onToggle={toggleDropdownUser}>
                            <Dropdown.Toggle className="form-control p-0 m-0" variant={'light'}>
                                <InputGroup >
                                    <Form.Control
                                        type='text'
                                        {...getFieldProps('user')}
                                        value={selectedUser == null ? assignmentResponse.assignedTo : selectedUser?.fullName}
                                        className="form-control border-0"
                                    />
                                    <InputGroup.Text className='bg-transparent border-0'>
                                        <FontAwesomeIcon icon={faSearch} ></FontAwesomeIcon>
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
                    <Form.Label column sm={3}>
                        Asset
                        <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                        <Dropdown show={showDropdownAsset} onToggle={toggleDropdownAsset}>
                            <Dropdown.Toggle className="form-control p-0 m-0" variant={'light'}>
                                <InputGroup>
                                    <Form.Control
                                        type='text'
                                        {...getFieldProps('asset')}
                                        value={selectedAsset == null ? assignmentResponse.assetName : selectedAsset?.assetName}
                                        className="form-control border-0"
                                    />
                                    <InputGroup.Text className='bg-transparent border-0'>
                                        <FontAwesomeIcon icon={faSearch} ></FontAwesomeIcon>
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
                    <Form.Label column sm={3}>
                        Assigned Date
                        <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control type="date"   value={assignmentResponse.assignedDate} disabled={true}  />
                    </Col>
                    
                </Form.Group>
                <Form.Group as={Row} className="mb-3" >
                    <Form.Label column sm={3}>
                        Note
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control as="textarea" {...getFieldProps('note')} defaultValue={assignmentResponse.note}/>
                    </Col>
                </Form.Group>

                <Row>
                    <Col className="d-flex justify-content-end my-4">
                        <Button variant="danger" className="mx-4" style={{ minWidth: "100px" }} type="submit" disabled={!formik.isValid || loading}> {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save"}</Button>
                        <Button variant="outline-dark" className="ms-4" style={{ minWidth: "100px" }} onClick={() => { navigate(-1) }}>Cancel</Button>
                    </Col>
                </Row>
                </>
        )}
            </Form>
        </Container >
    </>)
}