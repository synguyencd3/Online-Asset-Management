import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmModalProps {
    show: boolean,
    confirmTitle: string,
    confirmQuestion: string,
    confirmBtnLabel: string,
    cancelBtnLabel: string,
    onCancel: () => void,
    onConfirm: () => void
}

export const ConfirmModalComponent: React.FC<ConfirmModalProps> = ({ show, confirmTitle, confirmQuestion, confirmBtnLabel, cancelBtnLabel, onCancel, onConfirm }) => {
    return (
        <Modal className='' show={show} onHide={onCancel} centered>
            <Modal.Header className='border-bottom border-2 px-4' style={{ backgroundColor: '#EEE' }}>
                <Modal.Title style={{ color: '#dc3545', fontWeight: 'bold' }}>{confirmTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <p className='fs-5 px-2'>{confirmQuestion}</p>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: 'none' }}>
                <Button variant="danger" className='fw-semibold' onClick={onConfirm}>
                    {confirmBtnLabel}
                </Button>
                <Button variant="outline-secondary" className='fw-semibold' onClick={onCancel}>
                    {cancelBtnLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
