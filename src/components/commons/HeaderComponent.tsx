import React from 'react'
import { Navbar, Container } from 'react-bootstrap'
import { ColorPalette } from '../../utils/ColorPalette'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/AuthService'
import { message } from 'antd'
import { ErrorResponse } from '../../exceptions/ErrorResponse'

export const HeaderComponent: React.FC<{ title: string, handleLogout: (state: boolean, headerTitle: string) => void }> = ({ title, handleLogout }) => {
    const navigator = useNavigate();
    // const [messageApi, contextHolder] = message.useMessage();
    
    const handleLogOut = async () => {
        await logout()
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
                    handleLogout(true, 'LOG IN');
                    localStorage.removeItem('isLoggedIn');
                    navigator('/');
                    console.log(res.data);
                    console.log(res.status);
                }
            })
            .catch((err) => {
                const errorData = err.response.data.substring(0, err.response.data.indexOf('}') + 1);
                const errorResponse: ErrorResponse = JSON.parse(errorData);
                message.error(`${err.response.status}: ${errorResponse.message}`)
            });
    }

    return (
        <Navbar className="navbar" style={{ backgroundColor: ColorPalette.PRIMARY_COLOR, height: '90px' }}>
            <Container>
                <Navbar.Brand href="#" className='d-flex align-items-center'>
                    <h3 className="mx-5 my-2" style={{ color: 'white', fontWeight: '700' }}>{title}</h3>
                </Navbar.Brand>
                {localStorage.getItem('isLoggedIn') === 'true' ? (
                    <button className='btn' type='submit' onClick={handleLogOut}>
                        <FontAwesomeIcon className='fs-4 text-white' icon={faRightFromBracket} />
                    </button>
                ) : (<div></div>)}
            </Container>
        </Navbar>
    )
}