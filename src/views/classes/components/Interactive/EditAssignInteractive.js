import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment'
import { toast } from 'react-toastify';

function EditAssignInteractive({getIndteractive, editAssignInteractiveItem, editAssignIteractiveToggle, editAssignInteractiveModal}) {
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [editNotufy, setEditNotify] = useState(false)
  const {id} = useParams();

  const closeNotify = () =>{
    setEditNotify(false)
  }

  const updateAssignInteractive = async (e) => {
    e.preventDefault()
    if(startDate == endDate && startTime == endTime){
      toast.error('Start date must not earlier than the end date', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else{
      let interactiveId = editAssignInteractiveItem?.interactive?.id
      let moduleId = editAssignInteractiveItem?.module?.id
      let response = await new ClassesAPI().updateAssignInteractive(id, interactiveId, {startDate, startTime, endDate, endTime})
        if(response.ok){
          success()
          getIndteractive(null, moduleId)
          editAssignIteractiveToggle(e)
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

  useEffect(() => {
    if(editAssignInteractiveItem !== null) {
      setStartDate(editAssignInteractiveItem?.classInteractiveAssignment?.startDate)
      setStartTime(editAssignInteractiveItem?.classInteractiveAssignment?.startTime)
      setEndDate(editAssignInteractiveItem?.classInteractiveAssignment?.endDate)
      setEndTime(editAssignInteractiveItem?.classInteractiveAssignment?.endTime)
		}
  }, [editAssignInteractiveItem])

  const success = () => {
    toast.success('Successfully reassigned interactive!', {
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
       <Modal  size="lg" show={editAssignInteractiveModal} onHide={editAssignIteractiveToggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Edit Assign Class Interactive
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateAssignInteractive} >  
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setStartDate(e.target.value)} defaultValue={moment(editAssignInteractiveItem?.classInteractiveAssignment?.startDate).format('YYYY-MM-DD')}/>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Start Time</Form.Label>
              <Form.Control   type="time" onChange={(e) => setStartTime(e.target.value)} defaultValue={editAssignInteractiveItem?.classInteractiveAssignment?.startTime}/>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setEndDate(e.target.value)}  defaultValue={moment(editAssignInteractiveItem?.classInteractiveAssignment?.endDate).format('YYYY-MM-DD')} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Time</Form.Label>
              <Form.Control type="time" onChange={(e) => setEndTime(e.target.value)} defaultValue={editAssignInteractiveItem?.classInteractiveAssignment?.endTime} />
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit' >Update Class Interactive</Button>
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

export default EditAssignInteractive
