import React from 'react'
import { Outlet } from 'react-router-dom'
import { HeaderComponent } from '../commons/HeaderComponent'

export const PermissionCheck: React.FC = () => {
  return (
    <>
      <HeaderComponent title={'TEST'} />
      <Outlet />
    </>
  )
}
