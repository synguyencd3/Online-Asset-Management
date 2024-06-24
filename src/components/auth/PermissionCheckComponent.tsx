import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'

interface PermissionCheckProps {
    allowedRoles: number[];
    userRole: number;
}

export const PermissionCheck: React.FC<PermissionCheckProps> = ({ allowedRoles, userRole }) => {
    if (allowedRoles.includes(userRole)) {
        return (
            <Container>
                <Outlet />
            </Container>
        )
    } else {
        return <Navigate to="/not-have-permission" />;
    }
}
