import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';

function AssignedDiscussion({assignToggle, assignModal, discussionId, moduleId, getDiscussionUnit}) {
  console.log('discussionId:', discussionId)
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [assignNotify, setAssignNotify] = useState(false)
  const {id} = useParams();

  const closeNotify = () =>{
    setAssignNotify(false)
  }

  const assignDiscussion = async (e) =>{
    e.preventDefault()
    let response = await new ClassesAPI().assignDiscussion(id, discussionId, {startDate, startTime, endDate, endTime})
      if(response.ok){
        // alert('Discussion Assigned')
        setAssignNotify(true)
        setStartDate('')
        setStartTime('')
        setEndDate('')
        setEndTime('')
        assignToggle(e)
        getDiscussionUnit(null, moduleId)
      }else{
        alert(response.data.errorMessage)
      }
  }
  
  return (
    <div>
      <Modal  size="lg" show={assignModal} onHide={assignToggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Assign Discussion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={assignDiscussion}>  
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setStartDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Start Time</Form.Label>
              <Form.Control   type="time" onChange={(e) => setStartTime(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setEndDate(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Time</Form.Label>
              <Form.Control type="time" onChange={(e) => setEndTime(e.target.value)} />
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Save</Button>
            </Form.Group>
          </Form> 
        </Modal.Body>
      </Modal>
        <SweetAlert 
          success
          show={assignNotify} 
          title="Done!" 
           onConfirm={closeNotify}>
        </SweetAlert>
    </div>
  )
}
export default AssignedDiscussion
