import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment'
import { toast } from 'react-toastify';

function EditAssignDiscussion({editAssignToggle, editAssignModal, editAssignDiscussionItem, getDiscussionUnit}) {
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [editNotufy, setEditNotify] = useState(false)
  const {id} = useParams();

  const closeNotify = () =>{
    setEditNotify(false)
  }

  const updateAssignDIscussion = async (e) =>{
    e.preventDefault()
    let dId = editAssignDiscussionItem?.discussion?.id
    let response = await new ClassesAPI().updateAssignDiscusion(id, dId, {startDate, startTime, endDate, endTime})
      if(response.ok){
        success()
        getDiscussionUnit(null, editAssignDiscussionItem?.module?.id)
        editAssignToggle(e)

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
    toast.success('Successfully reassigned discussion!', {
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
    if(editAssignDiscussionItem !== null) {
      setStartDate(editAssignDiscussionItem?.discussionAssignment?.startDate)
      setStartTime(editAssignDiscussionItem?.discussionAssignment?.startTime)
      setEndDate(editAssignDiscussionItem?.discussionAssignment?.endDate)
      setEndTime(editAssignDiscussionItem?.discussionAssignment?.endTime)
		}
  }, [editAssignDiscussionItem])

  return (
    <div>
       <Modal  size="lg" show={editAssignModal} onHide={editAssignToggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Edit Assign Discussion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateAssignDIscussion} >  
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setStartDate(e.target.value)} defaultValue={moment(editAssignDiscussionItem?.discussionAssignment?.startDate).format('YYYY-MM-DD')}/>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Start Time</Form.Label>
              <Form.Control   type="time" onChange={(e) => setStartTime(e.target.value)} defaultValue={editAssignDiscussionItem?.discussionAssignment?.startTime}/>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Date</Form.Label>
              <Form.Control type="date" onChange={(e) => setEndDate(e.target.value)}  defaultValue={moment(editAssignDiscussionItem?.discussionAssignment?.endDate).format('YYYY-MM-DD')} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label >End Time</Form.Label>
              <Form.Control type="time" onChange={(e) => setEndTime(e.target.value)} defaultValue={editAssignDiscussionItem?.discussionAssignment?.endTime} />
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
export default EditAssignDiscussion
