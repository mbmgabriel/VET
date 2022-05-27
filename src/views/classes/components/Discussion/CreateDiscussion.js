import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

function CreateDiscussion({setModal, modal, toggle, classInfo, module, getDiscussionUnit}) {
  const [moduleId, setModuleId] = useState('')
  const [discussionName, setDiscussionName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [addNotify, setAddNotity] = useState(false)
  const courseId = classInfo?.classInformation?.courseId
  const allowLate = true
  const {id} = useParams();

  const closeNotify = () =>{
    setAddNotity(false)
  }

  const handleCloseModal = () => {
    setDiscussionName('')
    setInstructions('')
    setModuleId('')
    setModal(false)
  }

  const saveDiscussion = async (e) =>{
    e.preventDefault()
    if(moduleId === ''){
      toast.error('Please input all the required fields.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }); 
    }
    let response = await new ClassesAPI().createDiscussionModule(moduleId, id, {discussion:{discussionName, instructions,}, discussionAssignment:{allowLate}} )
    if(response.ok){
      // alert('Save Discussion')
      success()
      setDiscussionName('')
      setInstructions('')
      setModuleId('')
      getDiscussionUnit(null, moduleId)
      toggle(e)
    }else{
      toast.error(response.data.errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const success = () => {
    toast.success('Successfully created discussion!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

	return (
    <div>
    	<Modal size="lg" show={modal} onHide={handleCloseModal} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Create Discussion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={saveDiscussion} >  
          <Form.Group className="mb-3">
          <Form.Label>Unit</Form.Label>
            <Form.Select onChange={(e) => setModuleId(e.target.value)}>
              <option>Select Unit Here </option>
                {module.map(item => {
                  return(<option value={item.id}>{item.moduleName}</option>)
                })}
            </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Discussion Name</Form.Label>
              <Form.Control onChange={(e) => setDiscussionName(e.target.value)} type="text" placeholder='Enter discussion name here'/>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label >Instruction</Form.Label>
                    <Form.Control onChange={(e) => setInstructions(e.target.value)} type="text" placeholder='Enter instruction here'/>
                  </Form.Group>
              <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Save</Button>
            </Form.Group>
        </Form> 
        </Modal.Body>
      </Modal>
      <SweetAlert 
          success
          show={addNotify} 
          title="Done!" 
          onConfirm={closeNotify}>
        </SweetAlert>
    </div>
    )
}
export default CreateDiscussion