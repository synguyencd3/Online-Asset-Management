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

// Define the validation schema with Yup
const validationSchema = Yup.object({
    username: Yup.string()
        .required()
        .matches(/^[\x00-\x7F]*$/),
    password: Yup.string()
        .required()
        .matches(/^(?=.*[A-Za-z@$!%*#?&])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
});


export const LogInComponent: React.FC<{ setIsLoggedIn: (state: boolean) => void }> = ({ setIsLoggedIn }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [show, setShow] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const logInData: LogInModel = {
                username: values.username,
                password: values.password,
            };

            messageApi.open({
                type: 'loading',
                content: 'Logging in...'
            })
                .then(async () => {
                    await login(logInData)
                        .then((res) => {
                            console.log(res);
                            if (res.status == 200) {
                                setIsLoggedIn(true);
                                const loginResponse: LogInResponseModel = {
                                    username: res.data.data.username ?? 'username',
                                    roleId: res.data.data.roleId
                                }
                                console.log(loginResponse);
                                localStorage.setItem('isLoggedIn', 'true');
                                localStorage.setItem('isFirstLogin', res.data.data.isChangePassword);
                                localStorage.setItem('loginResponse', JSON.stringify(loginResponse));
                                message.success(res.data.message);
                            }
                        })
                        .catch((err) => {
                            console.log(err.response.status);
                            if (err.response.status === 401) {
                                console.log(err.response.data.message);
                                message.error('Username or password is incorrect. Please try again');
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
                        {/* {formik.touched.username && formik.errors.username ? (
                            <div className="error-message">{formik.errors.username}</div>
                        ) : null} */}
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
                        {/* {formik.touched.password && formik.errors.password ? (
                            <div className="error-message">{formik.errors.password}</div>
                        ) : null} */}
                    </Col>
                </Form.Group>
                <Row>
                    <Col className="d-flex justify-content-end mb-3">
                        <Button
                            variant='danger'
                            className="mx-4"
                            type="submit"
                            style={{ minWidth: "90px" }}
                            disabled={!formik.isValid || !formik.dirty}>
                            Login
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
        // <div className="container-fluid my-5">
        //     {contextHolder}
        //     <div className="row justify-content-center">
        //         <div className="col-lg-4 col-sm-3">
        //             <div className="card mt-5">
        //                 <div className="card-header text-center">
        //                     {/* <img src="/nashtech_logo.png" alt="Nash Tech Logo" className="logo" /> */}
        //                     <h3 className='my-4 fs-4' style={{ color: ColorPalette.PRIMARY_COLOR }}>Welcome to Online Asset Management</h3>
        //                 </div>
        //                 <div className="card-body text-left mt-4">
        //                     <form id="loginForm" className="d-flex flex-column justify-content-center" onSubmit={formik.handleSubmit}>
        //                         <div className="form-group mb-4">
        //                             <div className="form-control-container">
        //                                 <label htmlFor="username" className='fw-semibold me-3 text-uppercase'>
        //                                     Username:<span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
        //                                 </label>
        //                                 <input
        //                                     type="text"
        //                                     className="form-control fs-xs-2 fs-5 py-2"
        //                                     id="username"
        //                                     placeholder="Enter username"
        //                                     {...formik.getFieldProps('username')}
        //                                     aria-required
        //                                 />
        //                             </div>
        //                             {formik.touched.username && formik.errors.username ? (
        //                                 <div className="error-message">{formik.errors.username}</div>
        //                             ) : null}
        //                         </div>
        //                         <div className="form-group mb-3">
        //                             <div className="form-control-container">
        //                                 <label htmlFor="username" className='fw-semibold me-3 text-uppercase'>
        //                                     Password:<span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
        //                                 </label>
        //                                 <input
        //                                     type="password"
        //                                     className="form-control fs-5"
        //                                     id="password"
        //                                     placeholder="Enter password"
        //                                     {...formik.getFieldProps('password')}
        //                                     required
        //                                 />
        //                             </div>
        //                             {formik.touched.password && formik.errors.password ? (
        //                                 <div className="error-message">{formik.errors.password}</div>
        //                             ) : null}
        //                         </div>
        //                         <div className="d-flex justify-content-end">
        //                             <button id='btn-login' type="submit" className="btn px-5 py-2 fw-bold text-uppercase text-white" style={{ backgroundColor: ColorPalette.PRIMARY_COLOR }} disabled={!formik.isValid || !formik.dirty}>Login</button>
        //                         </div>
        //                     </form>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};
