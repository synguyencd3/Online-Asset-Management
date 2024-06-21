import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ColorPalette } from '../../utils/ColorPalette';

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
        <Modal size="sm" show={show} onHide={onCancel} centered>
            <Modal.Header className='border-bottom border-1 border-secondary px-4' style={{ backgroundColor: '#EEE' }}>
                <Modal.Title style={{ color: '#dc3545', fontWeight: 'bold' }}>{confirmTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pb-0'>
                <p className='px-2'>{confirmQuestion}</p>
            </Modal.Body>
            <Modal.Footer style={{ paddingTop: 0, borderTop: 'none',display: "flex", justifyContent: "start" }}>
                <Button style={{ backgroundColor: ColorPalette.PRIMARY_COLOR, border: 'none' }} className='fw-semibold' onClick={onConfirm}>
                    {confirmBtnLabel}
                </Button>
                <Button variant="outline-secondary" className='fw-semibold' onClick={onCancel}>
                    {cancelBtnLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
