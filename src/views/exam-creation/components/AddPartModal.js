import React, {useState} from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function AddPartModal({
  setShowModal,
  showModal,
  setTypeId,
  typeId,
  setInstructions,
  instructions,
  addPart,
  selectedPart,
  setFilesToUpload
}) {

  console.log('selectedPart:', selectedPart)

  const handleGetUploadedFile = (file) => {
    getBase64(file).then(
      data => {
        let toUpload = {
          "base64String": data,
          "fileName": file.name
        };
        setFilesToUpload(toUpload)
      }
    );
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  return (
    <Modal
      size='lg'
      className='modal-all'
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header className='modal-header' closeButton>
        {selectedPart == null && <>Exam Part Form</>}
        {selectedPart != null && <>Edit Part Form</>}
        
      </Modal.Header>
      <Modal.Body className='modal-label b-0px'>
        <Form onSubmit={addPart}>
          {selectedPart == null && <Form.Group className='m-b-20'>
            <Form.Label for='courseName'>Type of Test</Form.Label>
            <Form.Select
              aria-label='Default select example'
              onChange={(e) => setTypeId(e.target.value)}
            >
              <option value='1' selected={ '1' === typeId?.toString()}>Multiple Choice</option>
              <option value='2' selected={ '2' === typeId?.toString()}>True or False</option>
              <option value='3' selected={ '3' === typeId?.toString()}>Identification</option>
              <option value='4' selected={ '4' === typeId?.toString()}>Essay</option>
              <option value='5' selected={ '5' === typeId?.toString()}>Enumeration</option>
            </Form.Select>
          </Form.Group>}
          <Form.Group className='m-b-20'>
            <Form.Label for='description'>Test Instructions</Form.Label>
            <Form.Control
              defaultValue={""}
              className='custom-input'
              size='lg'
              type='text'
              value={instructions}
              placeholder='Enter test instructions'
              onChange={(e) => setInstructions(e.target.value)}
            />
          </Form.Group>
          {selectedPart == null &&<Form.Group className="mb-3">
            <Form.Label for='description'>Upload Excel File</Form.Label>
            <Form.Control type="file" accept=".xls,.xlsx," onChange={(e) => handleGetUploadedFile(e.target.files[0])} />
          </Form.Group>}
          <span style={{ float: "right" }}>
            <Button className='tficolorbg-button' type='submit'>
            {selectedPart == null && <>Add Part</>}
            {selectedPart != null && <>Update Part </>}
            </Button>
          </span>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
