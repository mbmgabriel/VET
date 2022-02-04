import React from 'react';
import {Row, Col} from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import moment from 'moment'


const ViewTask = ({viewTaskTaggle, viewTaskModal, viewTaskItem, viewTaskAssign}) => {
  console.log('startDatestartDatestartDate:', viewTaskAssign)
  
  return (
  <>
    <Modal  size="lg" show={viewTaskModal} onHide={viewTaskTaggle} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header className='class-modal-header' closeButton>
        <Modal.Title id="example-modal-sizes-title-lg" >
          {viewTaskItem?.taskName}
          <Row>
          {viewTaskAssign?(
          <>
          <Col sm={10} className='due-date-discusstion' style={{width:'auto', fontSize:'20px'}} >
            <div className='inline-flex'>
              <div className='text-color-bcbcbc'>
                Start Date:&nbsp;
              </div>
              <div className='text-color-707070'> 
                {moment(viewTaskAssign?.startDate).format('ll')}
              </div>
              <div className='text-color-707070'>
                /&nbsp;
              </div>
              <div className='text-color-707070'>
              {viewTaskAssign?.startTime}&nbsp;
              </div>
            </div>
          </Col>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Col sm={7} className='due-date-discusstion' style={{width:'auto'}} >
            <div className='inline-flex'>
              <div className='text-color-bcbcbc'>
                End Date:&nbsp;
              </div>
              <div className='text-color-707070'>
                {moment(viewTaskAssign?.endDate).format('ll')}&nbsp;
              </div>
              <div className='text-color-707070'>
                /&nbsp;
              </div>
              <div className='text-color-707070'>
              {viewTaskAssign?.endTime}&nbsp;
              </div>
            </div>
          </Col>
          </>
          ):(
          <>
            <div style={{color:'red', fontSize:'15px', paddingTop:'10px'}}>
              <b>Not Assigned</b>
            </div>
          </>
          )}
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className='text-color-707070' >
        <span style={{marginTop:"300px !important"}} dangerouslySetInnerHTML={{__html:viewTaskItem?.instructions }} />
      </div>
      </Modal.Body>
    </Modal>
  </>
  );
};

export default ViewTask;
