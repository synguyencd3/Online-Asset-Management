import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/SidebarStyle.css';
import { logoPNG } from '../../utils/ImageFiles';
import { BreadcrumbComponent } from './BreadcrumbComponent';

interface SidebarProps {
  setHeaderTitle: (title: ReactNode) => void,
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
      case '/admin/manage-users/new':
      case '/admin/manage-users/edit':
        setActiveIndex(1);
        break;
      case '/admin/manage-assets':
      case '/admin/manage-assets/new':
      case '/admin/manage-assets/edit':
        setActiveIndex(2);
        break;
      case '/admin/manage-assignments':
      case '/admin/manage-assignments/new':
      case '/admin/manage-assignments/edit':
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

  const handleOnClick = (index: number, title: ReactNode) => {
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
            <Link
              onClick={() => handleOnClick(0, <BreadcrumbComponent breadcrumb={[{
                title: 'Home',
                href: `${window.location.origin}/admin/home#`
              }]} />)}
              className='fs-5' to="/admin/home">Home</Link>
          </li>
          <li className={activeIndex === 1 ? 'active' : 'bg-light'}>
            <Link onClick={() => handleOnClick(1, <BreadcrumbComponent breadcrumb={[{
                title: 'Manage User',
                href: `${window.location.origin}/admin/manage-users#`
              }]} />)} 
              className='fs-5' to="/admin/manage-users">Manage User</Link>
          </li>
          <li className={activeIndex === 2 ? 'active' : 'bg-light'}>
            <Link onClick={() => handleOnClick(2, <BreadcrumbComponent breadcrumb={[{
                title: 'Manage Asset',
                href: `${window.location.origin}/admin/manage-assets#`
              }]} />)} 
              className='fs-5' to="/admin/manage-assets">Manage Asset</Link>
          </li>
          <li className={activeIndex === 3 ? 'active' : 'bg-light'}>
            <Link onClick={() => handleOnClick(3, <BreadcrumbComponent breadcrumb={[{
                title: 'Manage Assignment',
                href: `${window.location.origin}/admin/manage-assignments#`
              }]} />)} 
              className='fs-5' to="/admin/manage-assignments">Manage Assignment</Link>
          </li>
          <li className={activeIndex === 4 ? 'active' : 'bg-light'}>
            <Link onClick={() => handleOnClick(4, <BreadcrumbComponent breadcrumb={[{
                title: 'Request for Returning',
                href: `${window.location.origin}/admin/request-returning#`
              }]} />)} className='fs-5' to="/admin/request-returning">Request for Returning</Link>
          </li>
          <li className={activeIndex === 5 ? 'active' : 'bg-light'}>
            <Link onClick={() => handleOnClick(5, <BreadcrumbComponent breadcrumb={[{
                title: 'Report',
                href: `${window.location.origin}/admin/reports#`
              }]} />)} className='fs-5' to="/admin/reports">Report</Link>
          </li>
        </ul>
      ) : (<ul className="menu">
        <li className={activeIndex === 0 ? 'active' : 'bg-light'}>
          <Link onClick={() => handleOnClick(0, <BreadcrumbComponent breadcrumb={[{
                title: 'Home',
                href: `${window.location.origin}/user/home#`
              }]} />)} className='fs-5' to="/user/home">Home</Link>
        </li>
      </ul>)}
    </>
  )
}
