import React from 'react'
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap';

function ClassCoverPhoto({openCoverPhotoModal, setOpenCoverPhotoModal}) {
  return (
    <>
      <Modal size="lg" className="modal-all" show={openCoverPhotoModal} onHide={()=> setOpenCoverPhotoModal(false)} >
				<Modal.Header className="modal-header" closeButton>
          Upload Cover
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
            <Col>
              <input className='' accept="image/png, image/gif, image/jpeg" type='file' style={{ backgroundColor: 'inherit' }} />
            </Col>
            <Button  className="m-r-5 color-white tficolorbg-button float-right" size="sm">UPLOAD</Button>
					</Modal.Body>
			</Modal>
    </>
  )
}

export default ClassCoverPhoto