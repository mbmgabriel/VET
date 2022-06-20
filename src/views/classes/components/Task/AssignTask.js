import React, { useContext, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import { UserContext } from '../../../../context/UserContext'

function AssignTask({moduleId, getTaskModule, assignTaskModal, assignTaskToggle, taskName, assingTaskId, selectedTaskName}) {
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [assignNotify, setAssignNotify] = useState(false)
  const {id} = useParams();
  const {notify} = useContext(UserContext).data

  const closeNotify = () =>{
    setAssignNotify(false)
  }

  const notifyStudent = () => {
    console.log({selectedTaskName})
    const config = {
      "description": `task ${selectedTaskName} to you.`, 
      "activityType": "", 
      "classId": `${id}`
    }
    console.log({notification: config})
    notify(config)
  }

  const assignTask = async (e) => {
    e.preventDefault()
    let response = await new ClassesAPI().assignTask(id, assingTaskId, {startDate, startTime, endDate,endTime })
      if(response.ok){
        success()
        notifyStudent()
        setStartDate('')
        setStartTime('')
        setEndDate('')
        setEndTime('')
        assignTaskToggle(e)
        getTaskModule(null, moduleId)
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
    toast.success('Successfully assigned task!', {
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
      <Modal  size="lg" show={assignTaskModal} onHide={assignTaskToggle} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header className='class-modal-header' closeButton>
        <Modal.Title id="example-modal-sizes-title-lg" >
          Assign Task
      </Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Form onSubmit={assignTask}>  
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
              <Button className='tficolorbg-button' type='submit' >Save Task</Button>
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

export default AssignTask
