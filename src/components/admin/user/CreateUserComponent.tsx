import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ColorPalette } from "../../../utils/ColorPalette";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { message } from "antd";
import { UserModel } from "../../../models/UserModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { createUser } from "../../../services/UserService";

type Props = {
}

const eighteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

const createUserValidationSchema = Yup.object({
    firstName: Yup.string()
        .max(128,"First name must be at most 128 characters")
        .matches(/^[a-zA-Z]+$/,"First name cannot contain special characters")
        .required("First name is required"),
    lastName: Yup.string()
        .max(128, "Last name must be at most 128 characters")
        .matches(/^[a-zA-Z]+$/,"Last name cannot contain special characters")
        .required('Last name is required'),
    dateOfBirth: Yup.date()
        .max(eighteenYearsAgo, 'User is under 18. Please select a different date')
        // .max(new Date(), '\u200B')
        // .test('is-adult', 'User must be 18 years or older', function () {
        //     const today = new Date();
        //     const differenceMs = today.getMilliseconds() - eighteenYearsAgo.getMilliseconds();
        //     const differenceYears = Math.floor(differenceMs / (1000 * 60 * 60 * 24 * 365.25));

        //     return differenceYears === 18;
        // })
        .required('Date of birth is required'),
    joinedDate: Yup.date()
        .min(Yup.ref('dateOfBirth'), 'Joined date is not later than Date of Birth. Please select a different date')
        .test('is-weekend', 'Joined date is Saturday or Sunday. Please select a different date', function (value) {
            return (value && (value.getDay() != 6 && value.getDay() != 0))
        })
        .required('Joined date is required'),
    gender: Yup.string().required('Gender is required')
});

export const CreateUserComponent = (_props: Props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            roleId: "2",
            firstName: "",
            lastName: "",
            gender: "",
            joinedDate: "",
            dateOfBirth: "",
            location: localStorage.getItem("location") ?? "HCM",
            prefix: "SD",
        },
        validationSchema: createUserValidationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            /// temp body
            const body = {
                roleId: values.roleId,
                firstName: values.firstName,
                lastName: values.lastName,
                gender: values.gender,
                joinedDate: values.joinedDate,
                dateOfBirth: values.dateOfBirth,
                location: values.location,
                prefix: values.prefix
            }
            await createUser(body).then(response => {
                setLoading(false);
                const status = response.status
                if (status === 400) {
                    message.error(response.data);
                    setLoading(false);
                    return
                }
                const data = response.data;
                const newUser: UserModel = data.data;
                if (status === 201) {
                    navigate('/admin/manage-users', { replace: true, state: { newUser: newUser } });
                    return
                }
            }).catch(_e => {
                message.error("Fail to create user");
                return
            });
            setLoading(false)
        }
    });

    const { handleSubmit, handleChange, values, getFieldProps } = formik;

    return (
            <Container>
                <Form className="p-5" style={{ maxWidth: "60%", minWidth: "300px", textAlign: "left" }} onSubmit={handleSubmit}>
                    <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
                        Create New User
                    </h4>
                    <Form.Group as={Row} className="mb-3" controlId="firstName">
                        <Form.Label column sm={3} >
                            First Name
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text"  {...getFieldProps('firstName')} />
                            {formik.touched.firstName && formik.errors.firstName ? (
                            <div className="error-message">{formik.errors.firstName}</div>
                        ) : null}
                        </Col>

                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="lastName">
                        <Form.Label column sm={3}>
                            Last Name
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text"  {...getFieldProps('lastName')} />
                            {formik.touched.lastName && formik.errors.lastName ? (
                            <div className="error-message">{formik.errors.lastName}</div>
                        ) : null}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="dateOfBirth">
                        <Form.Label column sm={3}>
                            Date of Birth
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="date"  {...getFieldProps('dateOfBirth')} style={formik.errors.dateOfBirth ? { borderColor: "red" } : {}} />
                            {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                                <div className="error-message" style={formik.errors.dateOfBirth.length <= 1 ? { height: "0px" } : {}}>{formik.errors.dateOfBirth}</div>
                            ) : null}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="gender">
                        <Form.Label column sm={3}>
                            Gender
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9} id="gender" className="red-border-on-focus">
                            <Form.Check inline label="Female" name="gender" value="FEMALE" type="radio" id={"female"} className="me-5" onChange={handleChange} />
                            <Form.Check inline label="Male" name="gender" value="MALE" type="radio" id={"male"} onChange={handleChange} />
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
                            <Form.Control type="date"  {...getFieldProps('joinedDate')} style={formik.errors.joinedDate ? { borderColor: "red" } : {}} />
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
                                <option value="1" >Admin</option>
                                <option value="2">Staff</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="type">
                        <Form.Label column sm={3}>
                            Staff Type
                            <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Select name="prefix" value={values.prefix} onChange={handleChange} >
                                <option value="SD">SD</option>
                                <option value="BPS" >BPS</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    {values.roleId === "1" ?
                        <Form.Group as={Row} className="mb-3" controlId="location">
                            <Form.Label column sm={3}>
                                Location
                                <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Select name="location" value={values.location} onChange={handleChange} >
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
            </Container >
    );
}