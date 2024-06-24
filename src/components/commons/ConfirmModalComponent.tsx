import React from 'react';
import { Modal, Button, ModalProps } from 'react-bootstrap';
import { ColorPalette } from '../../utils/ColorPalette';

interface ConfirmModalProps {
    modalSize: string,
    show: boolean,
    confirmTitle: string,
    confirmQuestion: string,
    confirmBtnLabel: string,
    cancelBtnLabel: string,
    onCancel: () => void,
    onConfirm: () => void
}

export const ConfirmModalComponent: React.FC<ConfirmModalProps> = ({ modalSize, show, confirmTitle, confirmQuestion, confirmBtnLabel, cancelBtnLabel, onCancel, onConfirm }) => {
    return (
        <Modal size={modalSize as ModalProps["size"]} show={show} onHide={onCancel} centered>
            <Modal.Header className='border-bottom border-1 border-secondary' style={{ paddingLeft: '2.75vw', backgroundColor: '#EEE' }}>
                <Modal.Title style={{ color: '#dc3545', fontWeight: 'bold' }}>{confirmTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pb-0' style={{ paddingLeft: '2.5vw' }}>
                <p className='px-2'>{confirmQuestion}</p>
            </Modal.Body>
            <Modal.Footer style={{ paddingLeft: '2.75vw', paddingTop: 0, paddingBottom: '2vh', borderTop: 'none', display: "flex", justifyContent: "start" }}>
                <Button style={{ backgroundColor: ColorPalette.PRIMARY_COLOR, border: 'none' }} className='fw-semibold px-3' onClick={onConfirm}>
                    {confirmBtnLabel}
                </Button>
                <Button variant="outline-secondary" className='fw-semibold px-3' onClick={onCancel}>
                    {cancelBtnLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
