import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/SidebarStyle.css'

export const SidebarComponent: React.FC<{ setHeaderTitle: (title: string) => void }> = ({ setHeaderTitle }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleOnClick = (index: number, title: string) => {
    setActiveIndex(index);
    setHeaderTitle(title);
  }

  return (
    <aside className="col-sm-2 me-4">
      <div className="logo" style={{ marginBottom: '100px' }}>
        <img src="/nashtech_logo.png" alt="Logo" />
        <h2 className='text-left ms-3 fs-5 mb-2'>Online Asset Management</h2>
      </div>
      <ul className="menu">
        <li className={activeIndex === 0 ? 'active' : 'bg-light'}>
          <Link onClick={() => handleOnClick(0, 'Home')} className='fs-5' to="/">Home</Link>
        </li>
        <li className={activeIndex === 1 ? 'active' : 'bg-light'}>
          <Link onClick={() => handleOnClick(1, 'Manage User')} className='fs-5' to="/admin/manage-users">Manage User</Link>
        </li>
        <li className={activeIndex === 2 ? 'active' : 'bg-light'}>
          <Link onClick={() => handleOnClick(2, 'Manage Asset')} className='fs-5' to="/admin/manage-assets">Manage Asset</Link>
        </li>
        <li className={activeIndex === 3 ? 'active' : 'bg-light'}>
          <Link onClick={() => handleOnClick(3, 'Manage Assignment')} className='fs-5' to="/admin/manage-assignments">Manage Assignment</Link>
        </li>
        <li className={activeIndex === 4 ? 'active' : 'bg-light'}>
          <Link onClick={() => handleOnClick(4, 'Request for Returning')} className='fs-5' to="/admin/request-returning">Request for Returning</Link>
        </li>
        <li className={activeIndex === 5 ? 'active' : 'bg-light'}>
          <Link onClick={() => handleOnClick(5, 'Report')} className='fs-5' to="/admin/reports">Report</Link>
        </li>
      </ul>
    </aside>
  )
}
