import React, { useEffect, useState } from 'react';
import { PasswordModalComponent } from '../auth/PasswordModalComponent';


export const UserHomeComponent: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [firstLogin, setFirstLogin] = useState<boolean>(false);


    useEffect(() => {
        const isLoggedInFirst = sessionStorage.getItem('isFirstLogin') ? sessionStorage.getItem('isFirstLogin') : 'true';
        if (isLoggedInFirst === 'true') {
            setShowModal(false);
            setFirstLogin(false);
        } else {
            setShowModal(true);
        }
    }, []);

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div>
            {/* <TableComponent headers={[]} datas={[]} /> */}
            <div>AdminHomeComponent: React.FC</div>
            <PasswordModalComponent show={showModal} onClose={handleClose} isFirstLoggedIn={firstLogin} />
        </div>
    );
};
