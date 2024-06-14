import React from 'react'
import { Navbar, Container } from 'react-bootstrap'
import { ColorPalette } from '../../utils/ColorPalette'

export const HeaderComponent: React.FC<{ title: string }> = ({ title }) => {
    return (
        <Navbar className="navbar" style={{ backgroundColor: ColorPalette.PRIMARY_COLOR, height: '90px' }}>
            <Container>
                <Navbar.Brand href="#" className='d-flex align-items-center'>
                    <h3 className="mx-5 my-2" style={{ color: 'white', fontWeight: '700' }}>{title}</h3>
                </Navbar.Brand>
            </Container>
        </Navbar>
    )
}