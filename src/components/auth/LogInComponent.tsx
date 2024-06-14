import React, { FormEvent, useRef, useState } from 'react';
import { ColorPalette } from '../../utils/ColorPalette';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { LogInModel } from '../../models/LogInModel';

export const LogInComponent: React.FC<{ setIsLoggedIn: (state: boolean) => void }> = ({ setIsLoggedIn }) => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'danger' | null>(null);
    const navigate = useNavigate();

    // const logIn = async (data: LogInModel) => {
    //     try {
    //         const response = await axios.post('/api/login', data);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         throw new Error('Login failed');
    //     }
    // };

    const handleLoginSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const logInData = {
            username: usernameRef.current?.value ?? '',
            password: passwordRef.current?.value ?? '',
        };

        if (!logInData.username) {
            setAlertMessage('Username is required!');
            setAlertType('danger');
            return;
        }

        if (!logInData.password) {
            setAlertMessage('Password is required!');
            setAlertType('danger');
            return;
        }

        try {
            // const res = await logIn(logInData);

            if (true) {
                setAlertMessage('Login Successful!');
                setAlertType('success');
                setTimeout(() => {
                    setIsLoggedIn(true);
                    navigate('/admin/home');
                }, 1000);
            } else {
                setAlertMessage('Invalid username or password.');
                setAlertType('danger');
            }
        } catch (error) {
            setAlertMessage('Login failed. Please try again.');
            setAlertType('danger');
        }
    };

    return (
        <div className="container">
            {alertMessage && (
                <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                    {alertMessage}
                    <button type="button" className="btn-close" onClick={() => setAlertMessage(null)} aria-label="Close"></button>
                </div>
            )}
            <div className="row justify-content-center">
                <div className="col-xs-4 col-5">
                    <div className="card mt-5">
                        <div className="card-header text-center">
                            <img src="/nashtech_logo.png" alt="Nash Tech Logo" className="logo" />
                            <h3 style={{ color: ColorPalette.PRIMARY_COLOR }}>Welcome to Online Asset Management</h3>
                        </div>
                        <div className="card-body text-left my-2">
                            <form id="loginForm" className="d-flex flex-column justify-content-center" onSubmit={handleLoginSubmit}>
                                <div className="form-group d-flex align-items-center mb-3">
                                    <label htmlFor="username" className='fw-bold me-4 text-uppercase'>Username</label>
                                    <input ref={usernameRef} type="text" className="form-control fs-5 py-2" id="username" placeholder="Enter username" />
                                </div>
                                <div className="form-group d-flex align-items-center">
                                    <label htmlFor="password" className='fw-bold me-4 text-uppercase'>Password <br /></label>
                                    <input ref={passwordRef} type="password" className="form-control fs-5" id="password" placeholder="Enter password" />
                                    <small className="form-text text-muted" id="passwordHelp"></small>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn mt-4 px-5 btn-danger fs-5 fw-bold text-uppercase">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
