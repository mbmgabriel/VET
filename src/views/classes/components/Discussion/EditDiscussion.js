import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';

function EditDiscussion({modal, toggle, editDiscussionItem, getDiscussionUnit}) {
  const [discussionName, setDiscussionName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [editNotufy, setEditNotify] = useState(false)

  const closeNotify = () =>{
    setEditNotify(false)
  }

  const updateDiscussion = async (e) =>{
    e.preventDefault()
    let id = editDiscussionItem?.discussion?.id
    let mId = editDiscussionItem?.module?.id
    let response = await new ClassesAPI().updateDiscussion(id, {discussionName, instructions})
      if(response.ok){
        // alert('Discussion Updated')
        setEditNotify(true)
        getDiscussionUnit(null, mId)
        toggle(e)
      }else{
        alert(response.data.errorMessage)
      }
  }

  useEffect(() => {
    if(editDiscussionItem !== null) {
      setDiscussionName(editDiscussionItem?.discussion?.discussionName)
      setInstructions(editDiscussionItem?.discussion?.instructions)
		}
  }, [editDiscussionItem])

  return (
    <div>
       <Modal  size="lg" show={modal} onHide={toggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
             Edit Discussion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={updateDiscussion}>  
          <Form.Group className="mb-3">
          <Form.Label>Unit</Form.Label>
            <Form.Select disabled>
              <option>{editDiscussionItem?.module?.moduleName}</option>
            </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Discussion Name</Form.Label>
              <Form.Control   type="text" defaultValue={editDiscussionItem?.discussion?.discussionName} onChange={(e) => setDiscussionName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label >Instructions</Form.Label>
                    <Form.Control type="text" defaultValue={editDiscussionItem?.discussion?.instructions} onChange={(e) => setInstructions(e.target.value)} />
                  </Form.Group>
              <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Save</Button>
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
