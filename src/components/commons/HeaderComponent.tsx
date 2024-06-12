import React from 'react'
import { Navbar, Container } from 'react-bootstrap'

export const HeaderComponent: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#" className='d-flex align-items-center'>
            <img
              src="public/nashtech_logo.png"
              width="70"
              height="70"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
            <span className="m-3">{title}</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
  )
}
