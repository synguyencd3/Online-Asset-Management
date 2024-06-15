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
    <aside className="col-sm-2">
      <div className="logo" style={{ marginBottom: '100px' }}>
        <img src="/nashtech_logo.png" alt="Logo" />
        <h2 className='text-left ms-2 fs-4 mb-2'>Online Asset Management</h2>
      </div>
      <ul className="menu">
        <li className={activeIndex === 0 ? 'active' : 'bg-light'} onClick={() => handleOnClick(0, 'HOME')}>
          <Link className='fs-5' to="/">Home</Link>
        </li>
        <li className={activeIndex === 1 ? 'active' : 'bg-light'} onClick={() => handleOnClick(1, 'MANAGE USER')}>
          <Link className='fs-5' to="/admin/manage-users">Manage User</Link>
        </li>
        <li className={activeIndex === 2 ? 'active' : 'bg-light'} onClick={() => handleOnClick(2, 'MANAGE ASSET')}>
          <Link className='fs-5' to="/admin/manage-assets">Manage Asset</Link>
        </li>
        <li className={activeIndex === 3 ? 'active' : 'bg-light'} onClick={() => handleOnClick(3, 'MANAGE ASSIGNMENT')}>
          <Link className='fs-5' to="/admin/manage-assignments">Manage Assignment</Link>
        </li>
        <li className={activeIndex === 4 ? 'active' : 'bg-light'} onClick={() => handleOnClick(4, 'REQUEST FOR RETURNING')}>
          <Link className='fs-5' to="/admin/request-returning">Request for Returning</Link>
        </li>
        <li className={activeIndex === 5 ? 'active' : 'bg-light'} onClick={() => handleOnClick(5, 'REPORT')}>
          <Link className='fs-5' to="/admin/reports">Report</Link>
        </li>
      </ul>
    </aside>
  )
}
