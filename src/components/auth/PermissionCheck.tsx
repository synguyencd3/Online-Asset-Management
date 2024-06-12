import React from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'

export const PermissionCheck: React.FC = () => {
  return (
    <Container style={{ maxWidth: '100%' }} >
      <Outlet />
    </Container>
  )
}
