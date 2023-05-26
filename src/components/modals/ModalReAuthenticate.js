import React, { useState } from 'react';
import {Modal, Button, Form } from 'react-bootstrap';

const ModalReAuthenticate = ({ 
  title,  
  showModal, 
  setShowModal,  
  setPromptForCredentials,
}) => {
  const [newData, setNewData] = useState({email: '', password: ''})

  const handleSubmit = (e) => {
    e.preventDefault();

    setPromptForCredentials(newData);

    setShowModal(false);
  };

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

          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email"
                value={newData.email}
                onChange={(e) => setNewData({ ...newData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password"
                placeholder="Password"
                value={newData.password}
                onChange={(e) => setNewData({ ...newData, password: e.target.value })}
              />
            </Form.Group>
           <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
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
};

export default ModalReAuthenticate;