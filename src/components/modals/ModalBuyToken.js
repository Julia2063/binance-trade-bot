import React from 'react';
import {Modal, Button} from 'react-bootstrap';

const ModalBuyToken = ({showModal, setShowModal}) => {
    //#region Render
    return (
        <Modal
            show={showModal}
            fullscreen={false}
            onHide={() => {
                setShowModal(false);
            }}
            centered={true}
        >
            <div
                className={'ModalBuyToken'}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {'Buy BCB Tokens'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {'Use this wallet number to buy tokens'}
                    <p>
                        {'Some wallet number'}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type={'button'}
                        className={'btn-action CloseModalButton'}
                        onClick={() => {setShowModal(false)}}
                    >
                        Go back
                    </button>
                </Modal.Footer>
            </div>
        </Modal>
    );
    //#endregion
};

export default ModalBuyToken;
