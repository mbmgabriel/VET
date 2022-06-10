import React, { useState, useContext, useEffect } from 'react'
import { Accordion, Row, Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router'
import CoursesAPI from '../../../../../api/CoursesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment';
import { UserContext } from '../../../../../context/UserContext'
import { toast } from 'react-toastify';

function AccordionVideos({videos, getVideos, setOpenEditModal, setEditLinks, searchTerm}) {
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [itemId, setItemId] = useState('')
  const {id} = useParams();
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [courseInfo, setCourseInfo] = useState("");

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

  useEffect(() => {
    getCourseInformation();
  }, [])

  const getCourseInformation = async() => {
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfo(response.data)
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

  const deleteVidoes = async(item) => {
    let response = await new CoursesAPI().deleteLinks(id, item)
    if(response.ok){
      // alert('Vidoe Deleted')
      setDeleteNotify(false)
      getVideos()
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
            You will not be able to recover this data!
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
              </Col>
              {(user.teacher === null)?(
              <>
              </>
              ):(
              <>
               {courseInfo?.isTechfactors && user?.teacher.positionID != 7 ? null :
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
                </Col>}
              </>
              )}
              <Col sm={9}>
              </Col>
                <Col sm={3} style={{textAlign:'right'}} className='due-date-discusstion' >
                  <div className='inline-flex'>
                    <div className='text-color-bcbcbc'>
                    {
                      item.classLink === null ?
                      <span>Post Date {moment(item?.createdDate).format('ll')}</span>
                      :
                      <span>Post Date {moment(item?.classLink?.createdDate).format('ll')}</span>
                    }
                    </div>
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

export default AccordionVideos
