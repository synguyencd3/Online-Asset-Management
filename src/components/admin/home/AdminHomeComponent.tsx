import React, { useEffect, useState } from 'react';
import { PasswordModalComponent } from '../../auth/PasswordModalComponent';


export const AdminHomeComponent: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [firstLogin, setFirstLogin] = useState<boolean>(false);

  useEffect(() => {
    const isLoggedInFirst = Boolean(localStorage.getItem('isFirstLogin'));
    if (isLoggedInFirst) {
      setShowModal(false);
      setFirstLogin(isLoggedInFirst);
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
