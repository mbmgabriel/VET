import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment'
import { toast } from 'react-toastify';

function EditAssignTask({editAssignTaskItem, editAssignTaskToggle, editAssignTaskModal, getTaskModule}) {
  console.log('editAssignTaskItem:', editAssignTaskItem)
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [editNotufy, setEditNotify] = useState(false)
  const {id} = useParams();

  const closeNotify = () =>{
    setEditNotify(false)
  }

  const updateAssignTask = async (e) => {
    e.preventDefault()
    let  taskId = editAssignTaskItem?.taskAssignment?.taskId
    let  moduleId = editAssignTaskItem?.module?.id
    let response = await new ClassesAPI().updateAssignTask(id, taskId, {startDate, startTime, endDate, endTime})
      if(response.ok){
        getTaskModule(null, moduleId)
        success()
        editAssignTaskToggle(e)
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

  useEffect(() => {
    if(editAssignTaskItem !== null) {
      setStartDate(editAssignTaskItem?.taskAssignment?.startDate)
      setStartTime(editAssignTaskItem?.taskAssignment?.startTime)
      setEndDate(editAssignTaskItem?.taskAssignment?.endDate)
      setEndTime(editAssignTaskItem?.taskAssignment?.endTime)
		}
  }, [editAssignTaskItem])

  
  const success = () => {
    toast.success('Successfully updated task!', {
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
       <Modal  size="lg" show={editAssignTaskModal} onHide={editAssignTaskToggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Edit Assign Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateAssignTask} >  
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setStartDate(e.target.value)} defaultValue={moment(editAssignTaskItem?.taskAssignment?.startDate).format('YYYY-MM-DD')}/>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Start Time</Form.Label>
              <Form.Control   type="time" onChange={(e) => setStartTime(e.target.value)} defaultValue={editAssignTaskItem?.taskAssignment?.startTime}/>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setEndDate(e.target.value)}  defaultValue={moment(editAssignTaskItem?.taskAssignment?.endDate).format('YYYY-MM-DD')} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Time</Form.Label>
              <Form.Control type="time" onChange={(e) => setEndTime(e.target.value)} defaultValue={editAssignTaskItem?.taskAssignment?.endTime} />
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Update Task</Button>
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

export default EditAssignTask
