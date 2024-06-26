import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/SidebarStyle.css';
import { logoPNG } from '../../utils/ImageFiles';

interface SidebarProps {
  setHeaderTitle: (title: string) => void,
  roleId: number
}

export const SidebarComponent: React.FC<SidebarProps> = ({ setHeaderTitle, roleId }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    switch (location.pathname) {
      case '/admin/home':
      case '/user/home':
        setActiveIndex(0);
        break;
      case '/admin/manage-users':
        setActiveIndex(1);
        break;
      case '/admin/manage-assets':
        setActiveIndex(2);
        break;
      case '/admin/manage-assignments':
        setActiveIndex(3);
        break;
      case '/admin/request-returning':
        setActiveIndex(4);
        break;
      case '/admin/reports':
        setActiveIndex(5);
        break;
      default:
        setActiveIndex(null);
    }
  }, [location.pathname]);

  const handleOnClick = (index: number, title: string) => {
    setActiveIndex(index);
    setHeaderTitle(title);
  }

  return (
    <>
      <div className="logo" style={{ marginBottom: '100px' }}>
        <img src={logoPNG} alt="Logo" />
        <h2 className='text-left ms-3 fs-5 mb-2'>Online Asset Management</h2>
      </div>
      {roleId === 1 ? (
        <ul className="menu">
          <li className={activeIndex === 0 ? 'active' : 'bg-light'}>
            <Link onClick={() => handleOnClick(0, 'Home')} className='fs-5' to="/admin/home">Home</Link>
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
      ) : (<ul className="menu">
        <li className={activeIndex === 0 ? 'active' : 'bg-light'}>
          <Link onClick={() => handleOnClick(0, 'Home')} className='fs-5' to="/user/home">Home</Link>
        </li>
      </ul>)}
    </>
  )
}
