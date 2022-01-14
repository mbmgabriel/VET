import React, { useState } from 'react'
import { Accordion, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment';


function AccordionConference({conference, getConfe, setOpenEditModal, setEditLinks}) {
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [itemId, setItemId] = useState('')
  const {id} = useParams()

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const handleDeleteNotify = (item) =>{
    setDeleteNotify(true)
    setItemId(item)
  }
 

  const handleOpeEditModal = (e, item) => {
    e.preventDefault()
    setEditLinks(item)
    setOpenEditModal(true)
    
  }

  const deleteConference = async(item) => {
    let response = await new ClassesAPI().deleteLinks(id, item)
    if(response.ok){
      setDeleteNotify(false)
      getConfe()
    }else{
      alert("Something went wrong while fetching all Conference")
      
    }
  }

  return (
    <div>
      <Accordion>
        <SweetAlert
          warning
          showCancel
          show={deleteNotify}
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          onConfirm={() => deleteConference(itemId)}
          onCancel={cancelSweetAlert}
          focusCancelBtn
        >
            You will not be able to recover this imaginary file!
          </SweetAlert>
        <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className='unit-exam' style={{fontSize:'25px'}}>
            Conference 
          </div>
        </Accordion.Header>
        <Accordion.Body>
        {conference.map(item => {
          return ( 
            <Row>
              <Col sm={9}>
                <div className='title-exam'>
                  {/* <Link style={{color:'#EE9337', textDecoration:'none'}} to={item?.url}>  {item?.description} </Link> */}
                  <a target="_blank" style={{color:'#EE9337', textDecoration:'none'}}  href={item?.url}> {item?.description}</a>
                </div>
              </Col>
              <Col sm={3} className='icon-exam'>
                  <Button onClick={(e) => handleOpeEditModal(e, item)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i className="fa fa-edit"></i></Button>
                  <Button onClick={() => handleDeleteNotify(item?.classLink.id)} className="m-r-5 color-white tficolorbg-button" size="sm"> <i class="fas fa-trash-alt"></i> </Button>
              </Col>
              <Col sm={9}>
              </Col>
                <Col sm={3} style={{textAlign:'right'}} className='due-date-discusstion' >
                  <div className='inline-flex'>
                    <div className='text-color-bcbcbc'>
                      Post Date: {moment(item?.classLink.createdDate).format('ll')}&nbsp; 
                    </div>
                  </div>
                </Col>
                <div className='text-color-bcbcbc' >
                ___________________________________________________________________________________________________________________________________________________________________________________________________________
                </div>
            </Row>)
          })}
        </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default AccordionConference
