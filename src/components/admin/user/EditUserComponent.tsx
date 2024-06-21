import { useLocation, useNavigate } from "react-router-dom";
import { CORS_CONFIG, LOCAL_SERVICE_API } from "../../../utils/Config";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ColorPalette } from "../../../utils/ColorPalette";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from 'yup';
import { ModalUserModel } from "../../../models/ModalUserModel";

type Props = {
}
const eighteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

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

export const EditUserComponent = (props: Props) => {
    console.log(props);
    
    const url = LOCAL_SERVICE_API + "/users/"

    const location = useLocation();
    const [user] = useState<ModalUserModel>(location.state.user);

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { ...user, firstName: user.fullName.split(' ')[0], lastName: user.fullName.split(' ')[1] },
        validationSchema: createUserValidationSchema,
        onSubmit: async (values) => {
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
                <h4 style={{ color: ColorPalette.PRIMARY_COLOR, fontWeight: "bold" }} className="mb-4">
                    Edit User
                </h4>

                <Form.Group as={Row} className="mb-3" controlId="firstName">
                    <Form.Label column sm={3} >
                        First Name
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" disabled value={values.firstName} />
                    </Col>

                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="lastName">
                    <Form.Label column sm={3}>
                        Last Name
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" disabled value={values.lastName} />
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
                        <Form.Select name="type" defaultValue={values.roleId} disabled>
                            <option value="STAFF">STAFF</option>
                            <option value="ADMIN" >ADMIN</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="type">
                    <Form.Label column sm={3}>
                        {values.roleId === "ADMIN" ?
                            "Location" : "Department"}
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Select name={values.roleId === "ADMIN" ? "location" : "department"} defaultValue={""} disabled>
                            {values.roleId === "ADMIN" ?
                                <>
                                    <option value="0">HCM</option>
                                    <option value="1" >HN</option>
                                    <option value="2" >DN</option>
                                </>
                                : <>
                                    <option value="0">SD</option>
                                    <option value="1" >BDP</option>
                                </>
                            }
                        </Form.Select>
                    </Col>
                </Form.Group>


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