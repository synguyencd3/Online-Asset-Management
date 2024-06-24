import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ColorPalette } from '../../utils/ColorPalette';
import { message } from 'antd';
import { LogInModel, LogInResponseModel } from '../../models/LogInModel';
import { login } from '../../services/AuthService';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface LoginProps {
    setIsLoggedIn: (state: boolean, roleId: number) => void, 
    setUsername: (username: string) => void
}

// Define the validation schema with Yup
const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required'),
    password: Yup.string()
        .required('Password is required')
});

export const LogInComponent: React.FC<LoginProps> = ({ setIsLoggedIn, setUsername }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [show, setShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const logInData: LogInModel = {
                username: values.username,
                password: values.password,
            };
            setLoading(true);

            messageApi.open({
                type: 'loading',
                content: 'Logging in...'
            })
                .then(async () => {
                    await login(logInData)
                        .then((res) => {
                            console.log(res);
                            if (res.status == 200) {
                                const loginResponse: LogInResponseModel = {
                                    username: res.data.data.username ?? 'username',
                                    roleId: res.data.data.roleId,
                                    location: res.data.data.location
                                }
                                console.log(loginResponse);
                                setUsername(loginResponse.username);
                                sessionStorage.setItem('isLoggedIn', 'true');
                                sessionStorage.setItem('isFirstLogin', res.data.data.isChangePassword);
                                sessionStorage.setItem('username', res.data.data.username);
                                sessionStorage.setItem('roleId', res.data.data.roleId);
                                sessionStorage.setItem('location', res.data.data.location);
                                setIsLoggedIn(true, Number(res.data.data.roleId));
                                message.success(res.data.message);
                            }
                        })
                        .catch((err) => {
                            setLoading(false);
                            console.log(err.response.status);
                            if (err.response.status === 401) {
                                console.log(err.response.data.message);
                                message.error(err.response.data.message);
                            }
                            if (err.response.status == 403) {
                                message.error('You do not have permission to access this page!');
                            }
                        });
                });
        }
    });

    const handleShowPassword = () => {
        setShow(!show);
    }

    return (
        <Container fluid className='d-flex mt-5 justify-content-center'>
            {contextHolder}
            <Form className="mx-5 border border-2 rounded-3 mt-5" style={{ maxWidth: "60%", minWidth: "450px", textAlign: "left" }} onSubmit={formik.handleSubmit}>
                <h3 className='px-5 py-3 fs-5 text-center border-bottom border-2' style={{ color: ColorPalette.PRIMARY_COLOR, backgroundColor: ColorPalette.SLIVER_100_COLOR }}>
                    Welcome to Online Asset Management
                </h3>
                <Form.Group as={Row} className="mb-3 px-4 mt-4">
                    <Form.Label column sm={3} >
                        Username:<span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            id="username"
                            className="password-onfocus"
                            {...formik.getFieldProps('username')}
                            aria-required
                        />
                        {formik.touched.username && formik.errors.username ? (
                            <div className="error-message">{formik.errors.username}</div>
                        ) : null}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 px-4">
                    <Form.Label column sm={3} >
                        Password:<span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                        <InputGroup className="password-onfocus" >
                            <Form.Control
                                type={show ? 'text' : 'password'}
                                id="password"
                                className="form-control border-0"
                                {...formik.getFieldProps('password')}
                                aria-required
                            />
                            <InputGroup.Text className='bg-transparent border-0'>
                                <FontAwesomeIcon icon={show ? faEye : faEyeSlash} onClick={handleShowPassword}></FontAwesomeIcon>
                            </InputGroup.Text>
                        </InputGroup>
                        {formik.touched.password && formik.errors.password ? (
                            <div className="error-message">{formik.errors.password}</div>
                        ) : null}
                    </Col>
                </Form.Group>
                <Row>
                    <Col className="d-flex justify-content-end mb-3">
                        <Button
                            className="mx-4 text-white"
                            type="submit"
                            style={{ minWidth: "90px", backgroundColor: ColorPalette.PRIMARY_COLOR }}
                            disabled={!formik.isValid || !formik.dirty || loading === true }>
                            Login
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};
