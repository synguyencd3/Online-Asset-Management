import React from 'react'
import { Navbar, Container } from 'react-bootstrap'

export const HeaderComponent: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Navbar className="navbar" style={{ backgroundColor: '#cf2338', height: '90px' }}>
      <Container>
        <Navbar.Brand href="#" className='d-flex align-items-center'>
          <h3 className="mx-5 my-2" style={{ color: '#ffffff', fontWeight: '700' }}>{title}</h3>
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}
