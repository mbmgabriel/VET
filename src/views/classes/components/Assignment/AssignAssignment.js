import React, { useContext, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import { UserContext } from '../../../../context/UserContext'

function AssignAssignment({ selectedAssignmentName, moduleId, getAssignmentList, assginModal, assignAssignmentToggle, assignmentId }) {
  console.log('assingmentId:', assignmentId)
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [assignNotify, setAssignNotify] = useState(false)
  const {id} = useParams()
  
  const userContext = useContext(UserContext)
  const {notify} = userContext.data

  const notifyStudent = () => {
    const config = {
      "description": `assignment ${selectedAssignmentName} to you.`, 
      "activityType": "", 
      "classId": `${id}`
    }
    console.log({notification: config})
    notify(config)
  }
  
  const closeNotify = () => {
    setAssignNotify(false)
  }

  const assignAssignment = async (e) =>{
    e.preventDefault()
    let response = await new ClassesAPI().assignAssignment(id, assignmentId, {startDate, startTime, endDate, endTime})
      if(response.ok){
        notifyStudent()
        success()
        setStartDate('')
        setStartTime('')
        setEndDate('')
        setEndTime('')
        assignAssignmentToggle(false)
        getAssignmentList(null, moduleId)
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
    toast.success('Successfully assigned assignment', {
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
       <Modal  size="lg" show={assginModal} onHide={assignAssignmentToggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Assign Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={assignAssignment} >  
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setStartDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Start Time</Form.Label>
              <Form.Control   type="time" onChange={(e) => setStartTime(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setEndDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Time</Form.Label>
              <Form.Control type="time" onChange={(e) => setEndTime(e.target.value)}  />
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Save Assignment</Button>
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

export default AssignAssignment
