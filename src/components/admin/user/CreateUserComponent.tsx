import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ColorPalette } from "../../../utils/ColorPalette";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { CORS_CONFIG } from "../../../configs/CorsConfig";

type Props = {
    url: string;
}

const eighteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

const createUserValidationSchema = Yup.object({
    firstName: Yup.string()
        .max(128, 'First name must be at most 128 characters')
        .matches(/^[a-zA-Z]+$/, 'First name cannot contain special characters')
        .required('First name is required'),
    lastName: Yup.string()
        .max(128, 'Last name must be at most 128 characters')
        .matches(/^[a-zA-Z]+$/, 'Last name cannot contain special characters')
        .required('Last name is required'),
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

export const CreateUserComponent = (props: Props) => {
    const navigate = useNavigate();
    const url = props.url + "users"

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            joinedDate: "",
            gender: "",
            type: "0",
            location: "0",
            department: "0",
        },
        validationSchema: createUserValidationSchema,
        onSubmit: async (values) => {
            if (values.type == "0") {
                values.location = "0";
            }
            if (values.type == "1") {
                values.department = "0";
            }
            console.log(values);
            await axios.post(url, values, CORS_CONFIG).then(response => {
                console.log(response);

            }).catch(e => {
                console.log(e);
            });
        }
    });

    const { handleSubmit, handleChange, values, errors, getFieldProps, isSubmitting } = formik;

    useEffect(() => {
        const array = Object.keys(errors);
        if (array) {
            document.getElementById(array[0])?.focus();
        }
    }, [isSubmitting])

    return (

        <Container>
            <Form className="p-5" style={{ maxWidth: "60%", minWidth: "300px", textAlign: "left" }} onSubmit={handleSubmit}>
                <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
                    Create New User
                </h4>
                <Form.Group as={Row} className="mb-3" controlId="firstName">
                    <Form.Label column sm={3} >
                        First Name
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
                    </Form.Label>
                    <Col sm={9} id="gender" className="red-border-on-focus">
                        <Form.Check inline label="Female" name="gender" value="female" type="radio" id={"female"} className="me-5" onChange={handleChange} />
                        <Form.Check inline label="Male" name="gender" value="male" type="radio" id={"male"} onChange={handleChange} />
                        {formik.touched.gender && formik.errors.gender ? (
                            <div className="error-message">{formik.errors.gender}</div>
                        ) : null}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="joinedDate">
                    <Form.Label column sm={3}>
                        Joined Date
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control type="date"  {...getFieldProps('joinedDate')} />
                        {formik.touched.joinedDate && formik.errors.joinedDate ? (
                            <div className="error-message">{formik.errors.joinedDate}</div>
                        ) : null}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="type">
                    <Form.Label column sm={3}>
                        Type
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Select name="type" value={values.type} onChange={handleChange} >
                            <option value="0">STAFF</option>
                            <option value="1" >ADMIN</option>
                        </Form.Select>
                        {formik.touched.type && formik.errors.type ? (
                            <div className="error-message">{formik.errors.type}</div>
                        ) : null}
                    </Col>
                </Form.Group>
                {values.type === "1" ?
                    <Form.Group as={Row} className="mb-3" controlId="type">
                        <Form.Label column sm={3}>
                            Location
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Select name="location" value={values.location} onChange={handleChange} >
                                <option value="0">HCM</option>
                                <option value="1" >HN</option>
                                <option value="2" >DN</option>
                            </Form.Select>
                            {formik.touched.location && formik.errors.location ? (
                                <div className="error-message">{formik.errors.location}</div>
                            ) : null}
                        </Col>
                    </Form.Group>
                    : <Form.Group as={Row} className="mb-3" controlId="type">
                        <Form.Label column sm={3}>
                            Department
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Select name="department" value={values.department} onChange={handleChange} >
                                <option value="0">SD</option>
                                <option value="1" >BDP</option>
                            </Form.Select>
                            {formik.touched.department && formik.errors.department ? (
                                <div className="error-message">{formik.errors.department}</div>
                            ) : null}
                        </Col>
                    </Form.Group>
                }
                <Row>
                    <Col className="d-flex justify-content-end my-4">
                        <Button variant="danger" className="mx-4" style={{ minWidth: "100px" }} type="submit" > Save</Button>
                        <Button variant="outline-dark" className="ms-4" style={{ minWidth: "100px" }} onClick={() => { navigate(-1) }}>Cancel</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}