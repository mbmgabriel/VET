import React, { useState } from 'react'
import { Button, Form, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CoursesAPI from '../../../../api/CoursesAPI';

function CreateInterActive({openCreateInterModal, setOpenCreateInteractive, moduleId, getIndteractive}) {
  const [interactiveName, setInteractiveName] = useState('')
  const [rate, setRate] = useState(null)
  const [path, setPath] = useState('')
  const [sequenceNo, setSequenceNo] = useState('')

  console.log('moduleId:', moduleId)

  const CreateInterActive = async (e) => {
    e.preventDefault()
    if( interactiveName === '' || path === '' || sequenceNo === ''){
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
      let response = await new CoursesAPI().createInterActive( moduleId, {interactiveName, path, rate, sequenceNo})
      if(response.ok){
        handleCloseCreateInterActiveModal()
        notifySaveInteractive()
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

  const notifySaveInteractive = () => 
  toast.success('Successfully saved Interactive!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const handleCloseCreateInterActiveModal = () => {
    setOpenCreateInteractive(false)
    setRate(null)
    setInteractiveName('')
    setPath('')
    getIndteractive(moduleId)
  }
  return (
    <div>	<Modal size="lg" className="modal-all" show={openCreateInterModal} onHide={() => handleCloseCreateInterActiveModal()} >
    <Modal.Header className="modal-header" closeButton>
    Create Interactive
    </Modal.Header>
    <Modal.Body className="modal-label b-0px">
        <Form onSubmit={CreateInterActive} >
          <Form.Group className="m-b-20">
              <Form.Label for="courseName">
                  InterActive Name
              </Form.Label>
              <Form.Control 
                className="custom-input" 
                size="lg" 
                type="text" 
                placeholder="Enter Interactive Name"
                onChange={(e) => setInteractiveName(e.target.value)}
              />
          </Form.Group>
          <Form.Group className="m-b-20">
            <Form.Label for="courseName">
                Sequence no.
            </Form.Label>
            <Form.Control 
              className="custom-input" 
              size="lg" 
              type="number" 
              placeholder="Enter Sequence no."
              // min="0"
              // step="1" 
              onChange={(e) => setSequenceNo(e.target.value)}
            />
          </Form.Group>
          {/* <Form.Group className="m-b-20">
              <Form.Label for="courseName">
                  Rate
              </Form.Label>
              <Form.Control 
                className="custom-input" 
                size="lg" 
                type="number" 
                placeholder="Enter Rate"
                // min="0"
                // step="1" 
               onChange={(e) => setRate(e.target.value)}
              />
          </Form.Group> */}
          <Form.Group className="m-b-20">
              <Form.Label for="description">
                  Path
              </Form.Label>
              <Form.Control 
                className="custom-input" 
                size="lg" 
                type="text" 
                placeholder="Enter interactive url"
                // min="0"
                // step="1" 
               onChange={(e) => setPath(e.target.value) }
              />
          </Form.Group>

            <span style={{float:"right"}}>
                <Button  className="tficolorbg-button" type="submit">
                    Save Interactive
                </Button>
            </span>
        </Form>
    </Modal.Body>
  </Modal>
  </div>
  )
}
export default CreateInterActive