import React, { useEffect, useState } from 'react';
import { PasswordModalComponent } from '../../auth/PasswordModalComponent';

type Props = {
    setHeaderTitle: any
}

export const AdminHomeComponent: React.FC<Props> = ( props: Props ) => {
    const [showModal, setShowModal] = useState(false);
    const [firstLogin, setFirstLogin] = useState<boolean>(false);


    useEffect(() => {
        props.setHeaderTitle('Home');
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
