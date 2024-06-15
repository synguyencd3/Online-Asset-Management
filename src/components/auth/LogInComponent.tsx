import React, { FormEvent, useRef } from 'react';
import { ColorPalette } from '../../utils/ColorPalette';
import { message } from 'antd';
import { LogInModel } from '../../models/LogInModel';
import { login } from '../../services/AuthService';

export const LogInComponent: React.FC<{ setIsLoggedIn: (state: boolean) => void }> = ({ setIsLoggedIn }) => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const handleLoginSubmit = async (event: FormEvent) => {
        event.preventDefault();
        messageApi
            .open({
                type: 'loading',
                content: 'Checking log in...',
                duration: 3
            })
            .then(async () => {
                const logInData: LogInModel = {
                    username: usernameRef.current?.value ?? '',
                    password: passwordRef.current?.value ?? '',
                };

                if (!logInData.username) {
                    message.warning('Username is required!');
                    return;
                }

                if (!logInData.password) {
                    message.warning('Password is required!');
                    return;
                }

                await login(logInData)
                    .then((res) => {
                        console.log(res);
                        if (res.status == 200) {
                            setIsLoggedIn(true);
                            localStorage.setItem('isLoggedIn', 'true');
                            message.success('Sign in successful', 2);
                        }
                    })
                    .catch((err) => {
                        message.error(`${err.response.status}: ${err.response.data.message}`)
                    });
            });
    };

    return (
        <div className="container">
            {contextHolder}
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
