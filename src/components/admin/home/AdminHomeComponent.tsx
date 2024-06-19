import React, { useEffect, useState } from 'react';
import { PasswordModalComponent } from '../../auth/PasswordModalComponent';


export const AdminHomeComponent: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [firstLogin, setFirstLogin] = useState<boolean>(false);
  
  
  useEffect(() => {
    const isLoggedInFirst = localStorage.getItem('isFirstLogin') ? localStorage.getItem('isFirstLogin') : 'true';
    if (isLoggedInFirst === 'true') {
      setShowModal(false);
      setFirstLogin(false);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    // localStorage.removeItem('isFirstLogin');
  };

  return (
    <div>
      {/* <TableComponent headers={[]} datas={[]} /> */}
      <div>AdminHomeComponent: React.FC</div>
      <PasswordModalComponent show={showModal} onClose={handleClose} isFirstLoggedIn={firstLogin} />
    </div>
  );
};
