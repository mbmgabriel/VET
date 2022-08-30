import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import { toast } from 'react-toastify';

function StudentJoinClass({joinClassesToggle, joinClassestModal, getPendingClasses}) {
  const [code, setCode] = useState('')
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const submitRequest = async (e) => {
    e.preventDefault()
    setIsButtonDisabled(true)
    let response = await new ClassesAPI().submitRequest(code, {code})
      if(response.ok){
        getPendingClasses()
        setCode('')
        joinClassesToggle()
        toast.success('Done!');
        setIsButtonDisabled(false)
      }else{
        if(code === ''){
          toast.error('Please enter the classcode');
          setIsButtonDisabled(false)
        }else{
          toast.error(response.data.errorMessage);
          setIsButtonDisabled(false)
        } 
      }
  }

  return (
    <div>
      	<Modal size="lg" show={joinClassestModal} onHide={joinClassesToggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Join Classes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={submitRequest} >
          <Form.Group className="mb-4">
              <Form.Control onChange={(e) => setCode(e.target.value)} type="text" placeholder='Enter class Code here'/>
          </Form.Group>
          <Form.Group className='right-btn'>
						<Button disabled={isButtonDisabled} className='tficolorbg-button' type='submit'>Request</Button>
          </Form.Group>
        </Form>  
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default StudentJoinClass
