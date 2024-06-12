import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminComponent } from './components/admin/AdminComponent';
import { PermissionCheck } from './components/auth/PermissionCheck';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PermissionCheck />}>
          <Route path="/" element={<AdminComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
