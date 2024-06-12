import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SideBarComponent } from '../commons/SideBarComponent'
import { TableComponent } from '../TableComponent';

export const AdminComponent: React.FC = () => {
  const [tab, setTab] = useState('');
  return (
    <>
      <SideBarComponent />
      <Routes>
        <Route path='/admin' element={<TableComponent />} />
      </Routes>
    </>
  )
}
