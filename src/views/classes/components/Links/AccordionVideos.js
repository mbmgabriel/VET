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

function AccordionVideos({videos, getVideos, setOpenEditModal, setEditLinks, searchTerm}) {
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [itemId, setItemId] = useState('')
  const {id} = useParams();
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  

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
    console.log(item)
    setOpenEditModal(true)
    
  }

  const deleteVidoes = async(item) => {
    let response = await new ClassesAPI().deleteLinks(id, item)
    if(response.ok){
      // alert('Vidoe Deleted')
      setDeleteNotify(false)
      getVideos()
      successDelete()
    }else{
      alert("Something went wrong while fetching all Conference")
      
    }
  }

  const successDelete = () => {
    toast.success('Successfully deleted video link!', {
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
          onConfirm={() => deleteVidoes(itemId)}
          onCancel={cancelSweetAlert}
          focusCancelBtn
        >
            You will not be able to recover this Vidoe link!
        </SweetAlert>
        <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className='unit-exam' style={{fontSize:'25px'}}>
            Videos 
          </div>
        </Accordion.Header>
        <Accordion.Body>
          {videos?.filter((item) => {
            if(searchTerm == ''){
              return item
            } else if(item?.description.toLowerCase().includes(searchTerm.toLowerCase())){
              return item
            }
          }).map(item =>{
            return(
            <Row style={{margin:'10px'}}>
              <Col sm={9}>
                <div className='title-exam'>
                  {/* <Link style={{color:'#EE9337', textDecoration:'none'}} to={item?.url}>{item?.description}</Link> */}
                  <a target="_blank" className='class-links' href={item?.url}>{item?.description}</a>
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
              <>
              </>
              ):(
              <>
              {item?.classLink == null ? (<></>):(<>
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

export default AccordionVideos
