import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/SidebarStyle.css'

export const SidebarComponent: React.FC<{ setHeaderTitle: (title: string) => void }> = ({ setHeaderTitle }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleOnClick = (index: number, title: string) => {
    setActiveIndex(index);
    setHeaderTitle(title)
  }

  return (
    <aside className="sidebar col-sm-2">
      <div className="logo" style={{ marginBottom: '100px' }}>
        <img src="/nashtech_logo.png" alt="Logo" />
        <h2 className='text-left ms-2 fs-5 mb-2'>Online Asset Management</h2>
      </div>
      <ul className="menu">
        <li className={activeIndex === 0 ? 'active' : ''} onClick={() => handleOnClick(0, 'HOME')}>
          <Link to="/admin/home">Home</Link>
        </li>
        <li className={activeIndex === 1 ? 'active' : ''} onClick={() => handleOnClick(1, 'MANAGE USER')}>
          <Link to="/admin/manage-users">Manage User</Link>
        </li>
        <li className={activeIndex === 2 ? 'active' : ''} onClick={() => handleOnClick(2, 'MANAGE ASSET')}>
          <Link to="/admin/manage-assets">Manage Asset</Link>
        </li>
        <li className={activeIndex === 3 ? 'active' : ''} onClick={() => handleOnClick(3, 'MANAGE ASSIGNMENT')}>
          <Link to="/admin/manage-assignments">Manage Assignment</Link>
        </li>
        <li className={activeIndex === 4 ? 'active' : ''} onClick={() => handleOnClick(4, 'REQUEST FOR RETURNING')}>
          <Link to="/admin/request-returning">Request for Returning</Link>
        </li>
        <li className={activeIndex === 5 ? 'active' : ''} onClick={() => handleOnClick(5, 'REPORT')}>
          <Link to="/admin/reports">Report</Link>
        </li>
      </ul>
    </aside>
  )
}
