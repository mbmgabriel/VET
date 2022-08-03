import React from 'react'
import { Button, Form, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CoursesAPI from '../../../../api/CoursesAPI';

function EditInteractive({
  interactiveName,
  path,
  rate,
  interActiveId,
  openEditModal,
  setInteractiveName,
  setPath,
  setRate,
  setInterActiveId,
  setOpenEditModal,
  getIndteractive,
  moduleId,
  setModuleId
}) {

  const handleCloseEditInterActiveModal = () => {
    setInteractiveName('')
    setPath('')
    setInterActiveId()
    setOpenEditModal(false)
    getIndteractive(moduleId)
  }

  const editInteractive = async(e) => {
    e.preventDefault()
    if(interactiveName === '' || path === ''){
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
      let response = await new CoursesAPI().updateInterActive(interActiveId, {interactiveName, path, rate})
      if(response.ok){
        handleCloseEditInterActiveModal()
        notifyUpdateInteractive()
      }else{
        alert('ERROR')
      }
    }
  }

  const notifyUpdateInteractive = () => 
  toast.success('Successfully Updated Interactive!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  return (
    <div>
      	<Modal size="lg" className="modal-all" show={openEditModal} onHide={() => handleCloseEditInterActiveModal()} >
    <Modal.Header className="modal-header" closeButton>
    Edit Interactive
    </Modal.Header>
    <Modal.Body className="modal-label b-0px">
        <Form onSubmit={editInteractive} >
          <Form.Group className="m-b-20">
              <Form.Label for="courseName">
                  Interactive Name
              </Form.Label>
              <Form.Control 
                defaultValue={interactiveName}
                className="custom-input" 
                size="lg" 
                type="text" 
                placeholder="Enter Interactive Name"
                onChange={(e) => setInteractiveName(e.target.value)}
              />
          </Form.Group>
          <Form.Group className="m-b-20">
              {/* <Form.Label for="courseName">
                  Rate
              </Form.Label> */}
              {/* <Form.Control 
                defaultValue={rate}
                className="custom-input" 
                size="lg" 
                type="number" 
                placeholder="Enter Rate"
                // min="0"
                // step="1" 
               onChange={(e) => setRate(e.target.value)}
              /> */}
          </Form.Group>
          <Form.Group className="m-b-20">
              <Form.Label for="description">
                  Path
              </Form.Label>
              <Form.Control 
                defaultValue={path}
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
                    Update Interactive
                </Button>
            </span>
        </Form>
    </Modal.Body>
  </Modal>
    </div>
  )
}

export default EditInteractive