import React, { useState, useContext } from 'react'
import { Accordion, Row, Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router'
import CoursesAPI from '../../../../../api/CoursesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment';
import { UserContext } from '../../../../../context/UserContext'


function AccordionConference({conference, getConfe, setOpenEditModal, setEditLinks, searchTerm}) {
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [deleteitemId, setDeleteItemId] = useState('')
  const {id} = useParams();
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [confiId, setConfiId] = useState()

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const handleDeleteNotify = (item) =>{
    setDeleteNotify(true)
    setDeleteItemId(item)
  }
 

  const handleOpeEditModal = (e, confeItems) => {
    e.preventDefault()
    setEditLinks(confeItems)
    setOpenEditModal(true)
    
  }

  const deleteConference = async(item) => {
    let response = await new CoursesAPI().deleteLinks(id, item)
    if(response.ok){
      setDeleteNotify(false)
      getConfe()
    }else{
      alert("Something went wrong while fetching all Conference")
      
    }
  }

  const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )

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
          onConfirm={() => deleteConference(deleteitemId)}
          onCancel={cancelSweetAlert}
          focusCancelBtn
        >
            You will not be able to recover this data!
          </SweetAlert>
        <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className='unit-exam' style={{fontSize:'25px'}}>
            Conference 
          </div>
        </Accordion.Header>
        <Accordion.Body>
        {conference?.filter((item) => {
          if(searchTerm == ''){
            return item
          }else if(item?.description.toLowerCase().includes(searchTerm.toLowerCase())){
            return item
          }
        }).map(item => {
          return ( 
            <Row style={{margin:'10px'}}>
              <Col sm={9}>
                <div className='title-exam'>
                  {/* <Link style={{color:'#EE9337', textDecoration:'none'}} to={item?.url}>  {item?.description} </Link> */}
                  <a target="_blank" style={{color:'#EE9337', textDecoration:'none'}}  href={item?.url}> {item?.description}</a>
                </div>
              </Col>
              {(user.teacher === null)?(
              <></>
              ):(
              <>
                <Col sm={3} className='icon-exam'>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1, hide: 0 }}
                    overlay={renderTooltipEdit}>
                     <Button onClick={(e) => handleOpeEditModal(e, item)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i className="fa fa-edit"></i></Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1, hide: 0 }}
                    overlay={renderTooltipDelete}>
                    <Button onClick={() => handleDeleteNotify(item?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"> <i class="fas fa-trash-alt"></i> </Button>
                  </OverlayTrigger>
                </Col>
              </>
              )}

              <Col sm={9}>
              </Col>
                <Col sm={3} style={{textAlign:'right'}} className='due-date-discusstion' >
                  <div className='inline-flex'>
                      {
                      item.classLink === null ?
                      <span>Post Date {moment(item?.createdDate).format('ll')}</span>
                      :
                      <span>Post Date {moment(item?.classLink?.createdDate).format('ll')}</span>
                      }
                  </div>
                </Col>
                <div className='text-color-bcbcbc' >
                <hr></hr>
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
