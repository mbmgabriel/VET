import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import ClassCourseFileLibrary from '../ClassCourseFileLibrary';
import ContentField from '../../../../components/content_field/ContentField';

function EditDiscussion({setModal, setInstructions, instructions, modal, toggle, editDiscussionItem, getDiscussionUnit}) {
  const [discussionName, setDiscussionName] = useState('')
  // const [instructions, setInstructions] = useState('')
  const [editNotufy, setEditNotify] = useState(false)
  const [showFiles, setShowFiles] = useState(false);
  const closeNotify = () =>{
    setEditNotify(false)
  }

  const updateDiscussion = async (e) =>{
    e.preventDefault()
    if(discussionName === ''){
      toast.error('Please input all the required fields.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }); 
    }else{
      let id = editDiscussionItem?.discussion?.id
      let mId = editDiscussionItem?.module?.id
      let response = await new ClassesAPI().updateDiscussion(id, {discussionName, instructions})
        if(response.ok){
          success()
          getDiscussionUnit(null, mId)
          closeModal()
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
  }

  const success = () => {
    toast.success('Successfully Updated discussion!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  useEffect(() => {
    if(editDiscussionItem !== null) {
      setDiscussionName(editDiscussionItem?.discussion?.discussionName)
      // setInstructions(editDiscussionItem?.discussion?.instructions)
		}
  }, [editDiscussionItem])

  const closeModal = () => {
    setModal(false)
    setInstructions('')
  }

  return (
    <div>
       <Modal  size="lg" show={modal} onHide={closeModal} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
             Edit Discussion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={updateDiscussion}>  
          <div className={showFiles ? 'mb-3' : 'd-none'}>
            <ClassCourseFileLibrary />
          </div>
          <div className='text-align-right'>
            <Button className='tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
          </div>
          <Form.Group className="mb-3">
          <Form.Label>Unit</Form.Label>
            <Form.Select disabled>
              <option>{editDiscussionItem?.module?.moduleName}</option>
            </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Discussion Name</Form.Label>
              <Form.Control   type="text" placeholder='Enter discussion name here' defaultValue={editDiscussionItem?.discussion?.discussionName} onChange={(e) => setDiscussionName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label >Instruction</Form.Label>
                  <ContentField value={instructions} placeholder='Enter instruction here' onChange={value => setInstructions(value)} />
                  </Form.Group>
              <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Update Discussion</Button>
            </Form.Group>
        </Form> 
        </Modal.Body>
        </Modal>
        <SweetAlert 
            success
            show={editNotufy} 
            title="Done!" 
            onConfirm={closeNotify}>
          </SweetAlert>
    </div>
  )
}

export default EditDiscussion
