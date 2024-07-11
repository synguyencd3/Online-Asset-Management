import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ColorPalette } from "../../../utils/ColorPalette";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { ModalUserModel } from "../../../models/UserModel";
import { RolesLowerCase } from "../../../utils/Enum";
import { UserModel } from "../../../models/UserModel";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getOneUser, updateUser } from "../../../services/UserService";
import { BreadcrumbComponent } from "../../commons/BreadcrumbComponent";
import { ConfirmModalComponent } from "../../commons/ConfirmModalComponent";



const eighteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

interface ConfirmModalData {
	onConfirm: () => void;
	onCancel: () => void;
	confirmTitle: string;
	confirmQuestion: string;
	confirmBtnLabel: string;
	cancelBtnLabel: string;
}

const createUserValidationSchema = Yup.object({
    dateOfBirth: Yup.date()
        .max(eighteenYearsAgo, 'User is under 18. Please select a different date')
        .required('Date of birth is required'),
    joinedDate: Yup.date()
        .min(Yup.ref('dateOfBirth'), 'Joined date is not later than Date of Birth. Please select a different date')
        .test('is-weekend', 'Joined date is Saturday or Sunday. Please select a different date', function (value) {
            return (value && (value.getDay() != 6 && value.getDay() != 0))
        })
        .required('Joined date is required'),
    gender: Yup.string().required('Gender is required')
});
function formatDate(date: string) {
    let d = date.split("/");
    return ([d[2], d[1], d[0]].join('-'))
}

type Props = {
    setHeaderTitle: (title: ReactNode) => void
}

export const EditUserComponent = (props: Props) => {
    const location = useLocation();

    const [user] = useState<ModalUserModel>(location.state.user);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState<ConfirmModalData>();

    const navigate = useNavigate();

    let staffcodearray = user.staffCode.match(/[A-Za-z]+/);
    const prefix = staffcodearray ? staffcodearray[0] : "SD";

    function openModal(e: FormEvent<HTMLFormElement>) {
		setShowDisableModal(true);
		setConfirmModalData({
			onConfirm: () =>{
                handleCancel
                handleSubmit(e)
            },
			onCancel: handleCancel,
			confirmTitle: "Edit Confirmation",
			confirmQuestion: `You have changed joined date, which may affect their assignments. Do you still want to edit the User?`,
			confirmBtnLabel: "Yes",
			cancelBtnLabel: "No",
		});
	}

    const handleCancel = () => {
		setShowDisableModal(false);
	};

    useEffect(() => {
        props.setHeaderTitle(<BreadcrumbComponent breadcrumb={[
            {
              title: 'Manage User',
              href: `${window.location.origin}/admin/manage-users#`
            },
            {
              title: "Edit User",
              href: `${window.location.origin}/admin/manage-users/edit#`
            }
          ]} />);
    }, [])

    const formik = useFormik({
        initialValues: {
            ...user,
            roleId: RolesLowerCase[user.roleId as keyof typeof RolesLowerCase],
            dateOfBirth: formatDate(user.dateOfBirth),
            joinedDate: formatDate(user.joinedDate),
            firstName: user.fullName.split(' ')[0],
            lastName: user.fullName.split(' ')[1],
            prefix: prefix,
            gender:user.gender.toUpperCase()
        },
        validationSchema: createUserValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const body = {
                dateOfBirth: values.dateOfBirth,
                joinedDate: values.joinedDate,
                gender: values.gender,
                type: values.roleId
            }
            if (!formik.dirty) {
                messageApi.open({ type: 'warning', content: 'Please Change Information before Submit', });
                setLoading(false);
                return;
            }
            await updateUser(values.staffCode, body).then(async _response => {
                await getOneUser(values.staffCode).then(response => {
                    if (response.status === 200) {
                        const u: UserModel = response.data.data;
                        navigate('/admin/manage-users', { replace: true, state: { newUser: u } });
                    }
                }).catch(e => {
                    message.error(e.message);
                });
            }).catch(e => {
                message.error(e.message);
            });
            setLoading(false);
        }
    });

    const { handleSubmit, handleChange, values, errors, getFieldProps, isSubmitting } = formik;

    const handleShowModal = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formik.touched.joinedDate)
            openModal(e)
        else
            handleSubmit(e);
    }

    useEffect(() => {
        const array = Object.keys(errors);
        if (array) {
            document.getElementById(array[0])?.focus();
        }
    }, [isSubmitting])

    return (
        <>
            {contextHolder}
            <Container>
                 <Form className="p-5" style={{ maxWidth: "60%", minWidth: "300px", textAlign: "left" }} onSubmit={(e)=>handleShowModal(e)}>   {/* onSubmit={handleShowModal}>   onSubmit={handleSubmit}> */}
                    <h4 style={{ color: ColorPalette.PRIMARY_COLOR, fontWeight: "bold" }} className="mb-4">
                        Edit User
                    </h4>

                    <Form.Group as={Row} className="mb-3" controlId="firstName">
                        <Form.Label column sm={3} >
                            First Name
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" disabled value={values.firstName} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="lastName">
                        <Form.Label column sm={3}>
                            Last Name
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" disabled value={values.lastName} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="dateOfBirth">
                        <Form.Label column sm={3}>
                            Date of Birth
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="date"  {...getFieldProps('dateOfBirth')} />
                            {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                                <div className="error-message">{formik.errors.dateOfBirth}</div>
                            ) : null}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="gender">
                        <Form.Label column sm={3}>
                            Gender
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9} id="gender" className="red-border-on-focus">
                            <Form.Check inline label="Female" name="gender" value="FEMALE" type="radio" id={"female"} className="me-5" checked={values.gender === "MALE" ? false : true} onChange={handleChange} />
                            <Form.Check inline label="Male" name="gender" value="MALE" type="radio" id={"male"} className="me-5" checked={values.gender === "MALE" ? true : false} onChange={handleChange} />
                            {formik.touched.gender && formik.errors.gender ? (
                                <div className="error-message">{formik.errors.gender}</div>
                            ) : null}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="joinedDate">
                        <Form.Label column sm={3}>
                            Joined Date
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="date"  {...getFieldProps('joinedDate')} />
                            {formik.touched.joinedDate && formik.errors.joinedDate ? (
                                <div className="error-message">{formik.errors.joinedDate}</div>
                            ) : null}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="roleId">
                        <Form.Label column sm={3}>
                            Type
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Select name="roleId" value={values.roleId} onChange={handleChange} >
                                <option value={1}>Admin</option>
                                <option value={2}>Staff</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="type">
                        <Form.Label column sm={3}>
                            Staff Type
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Select name="prefix" value={values.prefix} onChange={handleChange} disabled>
                                <option value="SD">SD</option>
                                <option value="BPS" >BPS</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    {RolesLowerCase[values.roleId] === "Admin" ?
                        <Form.Group as={Row} className="mb-3" controlId="location">
                            <Form.Label column sm={3}>
                                Location
                                <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Select name="location" value={values.location} onChange={handleChange} disabled>
                                    <option value="HCM" >HCM: Ho Chi Minh</option>
                                    <option value="HN" >HN: Ha Noi</option>
                                    <option value="DN" >DN: Da Nang</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        : ""
                    }
                    <Row>
                        <Col className="d-flex justify-content-end my-4">
                        <Button variant="danger" className="mx-4" style={{ minWidth: "100px" }} type="submit" disabled={!formik.dirty || !formik.isValid || loading}> {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save"}</Button>
                        <Button variant="outline-dark" className="ms-4" style={{ minWidth: "100px" }} onClick={() => { navigate(-1) }}>Cancel</Button>
                        </Col>
                    </Row>
                </Form>
				{confirmModalData ? (
				<ConfirmModalComponent
					show={showDisableModal}
					onConfirm={confirmModalData.onConfirm}
					onCancel={confirmModalData.onCancel}
					confirmTitle={confirmModalData.confirmTitle}
					confirmQuestion={confirmModalData.confirmQuestion}
					confirmBtnLabel={confirmModalData.confirmBtnLabel}
					cancelBtnLabel={confirmModalData.cancelBtnLabel}
					modalSize={"md"}
				/>
			) : (
				""
			)}
            </Container>
        </>
    );
}