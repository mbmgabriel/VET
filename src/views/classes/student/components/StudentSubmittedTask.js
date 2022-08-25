import React, { useContext, useState, useEffect } from 'react'
import { Form, Button, } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

function StudentSubmittedTask({submittedTaskToggle, submittedTaskModal, taskAnswerItem, setSubmittedTaskModal}) {

  const downloadImage = (url) => {
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
        <Modal  size="lg" show={submittedTaskModal} onHide={() => setSubmittedTaskModal(false)} aria-labelledby="example-modal-sizes-title-lg">
          <Modal.Header className='class-modal-header' closeButton>
            <Modal.Title id="example-modal-sizes-title-lg" >
             Task 
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          
            <Form.Group className="mb-1">
              <Form.Label>Answer</Form.Label>
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control defaultValue={taskAnswerItem?.taskAnswer} as="textarea" rows={3} disabled />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Feed Back</Form.Label>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control defaultValue={taskAnswerItem?.feedback} type='text' disabled  />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Grade</Form.Label>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control defaultValue={taskAnswerItem?.taskGrade} type='text' disabled  />
            </Form.Group>
            <Form.Group className="mb-1">
            <Form.Label>File/s</Form.Label>&nbsp;&nbsp;&nbsp;
              {
                taskAnswerItem?.uploadedFiles?.map( itm => {
                  return (
                    <>
                      {/* {
                        itm.filePath.match(/.(jpg|jpeg|png|gif|pdf)$/i)
                        ?
                        <i class="fas fa-download td-file-page" onClick={() => downloadImage(itm.filePath)}></i>
                        : */}
                        <a href={itm.filePath} download={true} target='_blank'>
                          <spam style={{fontSize: '30px'}} ><i class="fas fa-download td-file-page mb-2"></i></spam>
                        </a> 
                      {/* } */}
                    </>
                  )
                })
              }
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button onClick={() => setSubmittedTaskModal(false)} className='tficolorbg-button'>OK</Button>
            </Form.Group>
   
          </Modal.Body>
        </Modal>
    </div>
  )
}

export default StudentSubmittedTask
