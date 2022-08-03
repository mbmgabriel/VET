import React, { useState, useContext } from 'react'
import { Accordion, Row, Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext'
import { toast } from 'react-toastify'
import Status from '../../../../components/utilities/Status';


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

  console.log('Con:', conference)

  const handleDeleteNotify = (item) =>{
    setDeleteNotify(true)
    setDeleteItemId(item)
  }
 

  const handleOpeEditModal = (e, confeItems) => {
    e.preventDefault()
    setEditLinks(confeItems)
    setOpenEditModal(true)
    
  }

  console.log('conference:', conference)

  const deleteConference = async(item) => {
    let response = await new ClassesAPI().deleteLinks(id, item)
    if(response.ok){
      setDeleteNotify(false)
      getConfe()
      successDelete()
    }else{
      alert("Something went wrong while fetching all Conference")
      
    }
  }

  const successDelete = () => {
    toast.success('Successfully deleted link!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
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
            You will not be able to recover this Conference Link!
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
                  <a target="_blank" className='class-links' href={item?.url}> {item?.description}</a>
                </div>
                <div className='inline-flex'>
                    <div className='text-color-bcbcbc'>
                      {
                      item.classLink === null ?
                      <span>Date Posted {moment(item?.createdDate).format('ll')}</span>
                      :
                      <span>Date Posted {moment(item?.classLink?.createdDate).format('ll')}</span>
                      }
                    </div>
                  </div>
              </Col>
              <Col sm={9}>
                {item?.classLink == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status></div>) : (<div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Class</Status></div>)}
              </Col>
              {(user.teacher === null)?(
              <></>
              ):(
              <>
              {(item?.classLink === null)?(<></>):(<>
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
                    <Button onClick={() => handleDeleteNotify(item?.classLink.id)} className="m-r-5 color-white tficolorbg-button" size="sm"> <i class="fas fa-trash-alt"></i> </Button>
                  </OverlayTrigger>
                </Col>
              </>)}

              </>
              )}

              <Col sm={6}>
              </Col>
                <Col sm={6} style={{textAlign:'right'}} className='due-date-discusstion' >
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
