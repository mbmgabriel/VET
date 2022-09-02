import React from 'react'
import { Form, Button, } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

function StudentSubmittedAssigment({submittedAssignmentToggle, submittedAssignment, studentAnswer}) {

  const  downloadImage = (url) => {
    fetch(url, {
      mode : 'no-cors',
    })
      .then(response => response.blob())
      .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.download = url.replace(/^.*[\\\/]/, '');
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  }

  return (
    <div>
      <Modal  size="lg" show={submittedAssignment} onHide={submittedAssignmentToggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <Form.Group className="mb-1">
            <Form.Label>Answer</Form.Label>
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Control  defaultValue={studentAnswer?.assignmentAnswer} as="textarea" rows={3} disabled />
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Label>Feed Back</Form.Label>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control defaultValue={studentAnswer?.feedback} as='textarea' disabled  />
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Label>Grade</Form.Label>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control defaultValue={studentAnswer?.assignmentGrade} type='text' disabled  />
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Label>Clink to view the files</Form.Label>&nbsp;&nbsp;&nbsp;
            {
              studentAnswer?.uploadedFiles?.map( itm => {
                return (
                  <>
                    {/* {
                      itm.filePath.match(/.(jpg|jpeg|png|gif|pdf)$/i)
                      ?
                      <i class="fas fa-download td-file-page" onClick={() => downloadImage(itm.filePath)}></i>
                      : */}
                      <a href={itm.filePath} download={true} target='_blank'>
                       <spam style={{fontSize:'25px'}} ><i class="fas fa-download td-file-page mb-2"></i> </spam>
                      </a> 
                    {/* } */}
                  </>
                )
              })
            }
          </Form.Group>
          <Form.Group className='right-btn'>
            <Button onClick={() => submittedAssignmentToggle()} className='tficolorbg-button' type='submit' >OK</Button>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default StudentSubmittedAssigment
