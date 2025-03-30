import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface PagesReadModalProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (pages: number) => void;
}

const PagesReadModal: React.FC<PagesReadModalProps> = ({ show, handleClose, handleSubmit }) => {
  const [pagesRead, setPagesRead] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onSubmit = (): void => {
    // Validate input
    if (!pagesRead || isNaN(Number(pagesRead)) || parseInt(pagesRead) <= 0) {
      setError('Please enter a valid number of pages');
      return;
    }
    
    // Pass the pages read value to parent component
    handleSubmit(parseInt(pagesRead));
    setPagesRead(''); // Reset the input
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reading Progress</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>How many pages did you read?</Form.Label>
            <Form.Control 
              type="number" 
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              isInvalid={!!error}
              min="1"
            />
            {error && <Form.Text className="text-danger">{error}</Form.Text>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Save Progress
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PagesReadModal;