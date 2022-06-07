import React from 'react';
import {Row, Col} from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import moment from 'moment'
import ContentViewer from '../../../components/content_field/ContentViewer';

const ViewAnnoncement = ({viewContent, viewTitle, viewDate, ViewAnnoncementModal, setViewAnnouncementModal}) => {

  return (
    <>
       <Modal  size="lg" show={ViewAnnoncementModal} onHide={() => setViewAnnouncementModal(false)} aria-labelledby="example-modal-sizes-title-lg">
          <Modal.Header className='class-modal-header' closeButton>
            <Modal.Title id="example-modal-sizes-title-lg" >
              <Row>
              <Col sm={10} className='due-date-discusstion' style={{width:'auto', fontSize:'20px'}} >
                <div>
                  <div className='dash-view-title'>
                    {viewTitle}
                  </div>
                  <div className='dash-view-date'>
                  &nbsp;&nbsp; {moment(viewDate).format('ll')}&nbsp;
                  </div>
                </div>
              </Col>
              {/* <Col sm={1} className='due-date-discusstion' style={{width:'auto'}} >
                <div className='inline-flex'>
                  <div className='dash-view-date'>
                    {moment(viewDate).format('ll')}&nbsp;
                  </div>
                </div>
              </Col> */}
              </Row>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className='text-color-707070' >
            {/* <span style={{marginTop:"300px !important"}} dangerouslySetInnerHTML={{__html:viewAssignmentItem?.instructions }} /> */}
            <ContentViewer>{viewContent}</ContentViewer>
          </div>
          </Modal.Body>
        </Modal>
    </>
  )
  
};

export default ViewAnnoncement;
