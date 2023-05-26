import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

const ModalNotification = ({title, message, showModal, setShowModal, areAuthButtonsVisible}) => {
    //#region Get navigate variable
    const navigate = useNavigate();
    //#endregion

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
                className={'ModalNotification'}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    {areAuthButtonsVisible &&
                        <>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    navigate('/login');
                                }}
                                className={'btn-action'}
                            >
                                Login
                            </button>
                            <button
                                className={'btn-action'}
                                onClick={() => {
                                    setShowModal(false);
                                    navigate('/register');
                                }}
                            >
                                Register
                            </button>
                        </>
                    }
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

export default ModalNotification;
