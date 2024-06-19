import React, { useEffect, useState } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { ColorPalette } from '../../utils/ColorPalette';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/AuthService';
import { message } from 'antd';
import { ErrorResponse } from '../../exceptions/ErrorResponse';
import { PasswordModalComponent } from '../auth/PasswordModalComponent';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfirmModalComponent } from './ConfirmModalComponent';

interface HeaderComponentProps {
    title: string,
    logo: string,
    handleLogout: (state: boolean, headerTitle: string) => void
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({ title, logo, handleLogout }) => {
    const navigator = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [username, setUsername] = useState<string>('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State for the Logout Modal

    useEffect(() => {
        const loginResponse = localStorage.getItem('loginResponse');
        setUsername(loginResponse ? JSON.parse(loginResponse).username : 'username');
    }, [])

    const handleLogOut = async () => {
        messageApi.open({
            type: 'loading',
            content: 'Logging out...',
        })
            .then(async () => {
                console.log(import.meta.env.VITE_AZURE_BACKEND_DOMAIN);
                await logout()
                    .then((res) => {
                        console.log(res);
                        if (res.status == 200) {
                            handleLogout(true, 'Online Asset Management');
                            localStorage.removeItem('loginResponse');
                            localStorage.removeItem('isLoggedIn');
                            navigator('/');
                            console.log(res.data);
                            console.log(res.status);
                            message.success(`Logout successfully!`);
                        }
                    })
                    .catch((err) => {
                        console.log(process.env.REACT_APP_AZURE_BACKEND_DOMAIN);
                        const errorData = err.response.data.substring(0, err.response.data.indexOf('}') + 1);
                        const errorResponse: ErrorResponse = JSON.parse(errorData);
                        message.error(`${errorResponse.message}`);
                    });
            });
    }

    const handleLogoutClick = () => {
        setShowLogoutModal(true); // Show the Logout Modal
    }

    const handleLogoutConfirm = () => {
        setShowLogoutModal(false);
        handleLogOut(); // Call the logout function
    }

    const handleLogoutCancel = () => {
        setShowLogoutModal(false); // Hide the Logout Modal
    }

    const handleClose = () => {
        setShowPasswordModal(false);
        localStorage.removeItem('isFirstLogin');
    };

    const handleChangePassword = () => {
        setShowPasswordModal(true);
    }

    return (
        <>
            <Navbar className="navbar" style={{ backgroundColor: ColorPalette.PRIMARY_COLOR, height: '90px' }}>
                {contextHolder}
                <Container fluid className='d-flex justify-content-between'>
                    <Navbar.Brand href="#" id='navigate-bar' className='d-flex align-items-center ps-5'>
                        {logo ? <img src={logo} className='logo my-auto' alt='logo' /> : <div></div>}
                        <h3 className="my-2 mx-4 fs-3 text-white fw-semibold" id='navbar-title'>{title}</h3>
                    </Navbar.Brand>
                    {localStorage.getItem('isLoggedIn') ? (
                        <div id="navbarNavDarkDropdown">
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle text-end text-white d-inline-flex align-items-center" href="#" id="navbarDarkDropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                        <div id='username' className="username-logged fw-semibold fs-5">{username}</div>
                                        <FontAwesomeIcon className="mx-2" icon={faCaretDown} />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDarkDropdownMenuLink">
                                        <li><button className="btn dropdown-item py-2" onClick={handleChangePassword} >Change Password</button></li>
                                        <li><button className="btn dropdown-item py-2" onClick={handleLogoutClick} >Log Out</button></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    ) : (<div></div>)}
                </Container>
            </Navbar>
            <PasswordModalComponent show={showPasswordModal} onClose={handleClose} isFirstLoggedIn={true} />
            <ConfirmModalComponent show={showLogoutModal} onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} confirmTitle={'Are you sure?'} confirmQuestion={'Do you want to log out?'} confirmBtnLabel={'Log out'} cancelBtnLabel={'Cancel'} />
        </>
    )
}
