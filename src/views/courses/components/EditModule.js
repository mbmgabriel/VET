import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';

function EditModule({
  setEditModuleModal,
  editModuleModal,
  moduleName,
  moduleDescription,
  sequenceNo,
  moduleId,
  setModuleName,
  setModuleDescription,
  setSequenceNo,
  setModuleId,
  getCourseUnitInformation
}) {

  const handleCloseModal = () => {
    setModuleName('')
    setModuleDescription('')
    setSequenceNo('')
    setModuleId('')
    setEditModuleModal(false)
  }

  const updateModule = async (e) => {
    e.preventDefault()
    let response = await new  CoursesAPI().updateModule(moduleId, {moduleName, moduleDescription, sequenceNo})
      if(response.ok){
        notifyUpdateModule('')
        getCourseUnitInformation()
        handleCloseModal()
      }else{
        alert(response.data.errorMessage)
      }
  }

  const notifyUpdateModule = () => 
  toast.success('Successfully Updated lesson!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  

  return (
  	<div>
    <Modal size="lg" className="modal-all" show={editModuleModal} onHide={()=> handleCloseModal()} >
      <Modal.Header className="modal-header" closeButton>
      Edit Module
      </Modal.Header>
      <Modal.Body className="modal-label b-0px">
        <Form onSubmit={updateModule} >
          <Form.Group className="m-b-20">
            <Form.Label for="moduleName">
                Module Name
            </Form.Label>
            <Form.Control
              defaultValue={moduleName} 
              className="custom-input" 
              size="lg" 
              type="text" 
              placeholder="Enter module name"
              onChange={(e) => setModuleName(e.target.value)}
            />
          </Form.Group>
          {' '}

          <Form.Group className="m-b-20">
            <Form.Label for="description">
                Module Description
            </Form.Label>
            <Form.Control 
              defaultValue={moduleDescription}
              className="custom-input" 
              size="lg" 
              type="text" 
              placeholder="Enter module description"
              onChange={(e) => setModuleDescription(e.target.value)}
            />
          </Form.Group>
          {' '}

          <Form.Group className="m-b-20">
            <Form.Label for="description">
                Sequence Number
            </Form.Label>
            <Form.Control 
              defaultValue={sequenceNo}
              className="custom-input" 
              size="lg" 
              type="number" 
              placeholder="Enter sequence"
              onChange={(e) => setSequenceNo(e.target.value)}
            />
          </Form.Group>
          {' '}
      
          <span style={{float:"right"}}>
            <Button className="tficolorbg-button" type="submit">
                Edit Module
            </Button>
          </span>
        </Form>
      </Modal.Body>
    </Modal>
  </div>
  )
}

export default EditModule