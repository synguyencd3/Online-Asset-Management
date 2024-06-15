import React from 'react'
import { Navbar, Container } from 'react-bootstrap'
import { ColorPalette } from '../../utils/ColorPalette'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const HeaderComponent: React.FC<{ title: string }> = ({ title }) => {
    const navigator = useNavigate();
    const handleLogOut = async () => {
        const res = await axios.post('http://localhost:8080/api/v1/auth/logout', { withCredentials: true });
        if (res.status === 200) {
            sessionStorage.removeItem('isLogIn');
            navigator('/');
            console.log('success');
        } else {
            console.log('failure');
        }
    }

    return (
        <Navbar className="navbar" style={{ backgroundColor: ColorPalette.PRIMARY_COLOR, height: '90px' }}>
            <Container>
                <Navbar.Brand href="#" className='d-flex align-items-center'>
                    <h3 className="mx-5 my-2" style={{ color: 'white', fontWeight: '700' }}>{title}</h3>
                </Navbar.Brand>
                {sessionStorage.getItem('isLogIn') === 'true' ? (
                    <button type='submit' onClick={handleLogOut}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </button>
                ) : (<div></div>)}
            </Container>
        </Navbar>
    )
}