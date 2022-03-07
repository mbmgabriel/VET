import React, { useState, useContext } from 'react'
import { Accordion, Row, Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router'
import ClassesAPI from '../../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment';
import { UserContext } from '../../../../context/UserContext'

function AccordionLinks({links, getLinks, setOpenEditModal, setEditLinks, searchTerm}) {
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [itemId, setItemId] = useState('')
  const {id} = useParams()
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

  const deleteLink = async(item) => {
    let response = await new ClassesAPI().deleteLinks(id, item)
    if(response.ok){
      // alert('Link Deleted')
      setDeleteNotify(false)
      getLinks()
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
          onConfirm={() => deleteLink(itemId)}
          onCancel={cancelSweetAlert}
          focusCancelBtn
        >
            You will not be able to recover this imaginary file!
        </SweetAlert>
        <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className='unit-exam' style={{fontSize:'25px'}}>
            Links 
          </div>
        </Accordion.Header>
        <Accordion.Body>
          {links?.filter((item) => {
            if(searchTerm == ''){
              return item
            }else if(item?.description.toLowerCase().includes(searchTerm.toLowerCase())){
              return item
            }
          }).map(item => {
            return( <Row>
              <Col sm={9}>
                <div className='title-exam'>
                {/* <Link style={{color:'#EE9337', textDecoration:'none'}} to={item?.url}>{item?.description}</Link> */}
                <a target="_blank" style={{color:'#EE9337', textDecoration:'none'}} href={item?.url}>{item?.description}</a>
                </div>
              </Col>
              {(user.teacher === null)?(
              <>
              </>
              ):(
              <>
                <Col sm={3} className='icon-exam'>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 10, hide: 25 }}
                    overlay={renderTooltipEdit}>
                  <Button onClick={(e) => handleOpeEditModal(e, item)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i className="fa fa-edit"></i></Button>
                 </OverlayTrigger> 
                 <OverlayTrigger
                    placement="right"
                    delay={{ show: 10, hide: 25 }}
                    overlay={renderTooltipDelete}>
                  <Button onClick={() => handleDeleteNotify(item?.classLink.id)} className="m-r-5 color-white tficolorbg-button" size="sm"> <i class="fas fa-trash-alt"></i> </Button>
                </OverlayTrigger>
                </Col>
              </>
              )}
              <Col sm={9}>
              </Col>
                <Col sm={3} style={{textAlign:'right'}} className='due-date-discusstion' >
                  <div className='inline-flex'>
                    <div className='text-color-bcbcbc'>
                      Post Date: {moment(item?.classLink?.createdDate).format('ll')}&nbsp;
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

export default AccordionLinks
