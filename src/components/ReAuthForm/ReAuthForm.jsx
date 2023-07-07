import { useContext, useEffect, useState } from 'react';
import {Button, Form } from 'react-bootstrap';
import { AppContext } from '../../helpers/appContext';

export const ReAuthForm = ({  handleModal, setPromptForCredentials }) => {
    const { user } = useContext(AppContext);
    const [newData, setNewData] = useState({email: '', password: ''});

    useEffect(() => {
        setNewData({...newData, email: user.email})
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        setPromptForCredentials(newData);
    
        handleModal();
      };
    return (
        <Form onSubmit={(e) => handleSubmit(e)}>
            <h6 style={{ 'text-align': 'center', 'padding-top': '40px'}}>To change your password, you need to re-authorize</h6>
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
    );
};