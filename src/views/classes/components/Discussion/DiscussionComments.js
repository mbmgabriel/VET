import React, {useContext, useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, Row, Col, InputGroup, FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap'
import moment from 'moment'
import { useParams } from 'react-router'
import ClassesAPI from '../../../../api/ClassesAPI'
import { UserContext } from '../../../../context/UserContext'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

function DiscussionComments({getDiscussionComments, getComments, discussionCommentToggle, discussionCommentModal, comments, discussionId, moduleId, getDiscussionUnit, startDate, startTime, endDate, endTime}) {
  const {id} = useParams()
  const userContext = useContext(UserContext)
  const [commentAlert, setCommentAlert] = useState(false)
  const {user} = userContext.data
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [itemId, setItemId] = useState('')
  const [reply, setReply] = useState('')
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  const dateTimeNow = dateCompareNow + ' ' + '00:00:00';

  const handleDeleteNotify = (item) =>{
    getDiscussionUnit(null, moduleId)
    setDeleteNotify(true)
    setItemId(item)
  }
  const closeNotify = () =>{
    setCommentAlert(false)
  }

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const submitComment = async (e, item) => {
    e.preventDefault()
    let classId = id
    let userAccountId = user?.userId
    let response = await new ClassesAPI().submitComment(classId, item, {userAccountId, reply})
      if(response.ok){
        // setCommentAlert(true)
        commendToast()
        setReply('')
        getDiscussionComments(null, item, startDate, startTime, endDate, endTime)
      }else{
        // alert(response.data.errorMessage)
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

  const deleteComment = async (item) => {
    let classId = id
    let response = await new ClassesAPI().deleteComment(classId, discussionId, item)
      if(response.ok){
        // alert('deleted')
        deleteToast()
        setDeleteNotify(false)
        getDiscussionComments(null, discussionId, startDate, startTime, endDate, endTime)
      }else{
        alert(response.data.errorMessage)
      }
  }

  const deleteToast = () => {
    toast.success('Successfully removed comment!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  const commendToast = () => {
    toast.success('Successfully added comment!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  const renderTooltipDelete= (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )

  return (
  <div>
    <SweetAlert
      warning
      showCancel
      show={deleteNotify}
      confirmBtnText="Yes, delete it!"
      confirmBtnBsStyle="danger"
      title="Are you sure?"
      onConfirm={() => deleteComment(itemId)}
      onCancel={cancelSweetAlert}
      focusCancelBtn
      >
        You will not be able to recover this imaginary file!
    </SweetAlert>
      <Modal  size="lg" show={discussionCommentModal} onHide={discussionCommentToggle} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header className='class-modal-header' closeButton>
        <Modal.Title id="example-modal-sizes-title-lg" >
          Discussion Comments
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
  
      {(discussionCommentModal === true)?(<>
        {(getComments.map(item => {
          return(
            <>
        <Row>
        
        <div className='inline-flex' >
        <Col sm={11} className='inline-flex'>
          <InputGroup.Text id="basic-addon2" className="feed-logo"><i class="fas fa-user-circle fas-1x" ></i></InputGroup.Text>
          <div className='inline-flex' style={{paddingTop:'12px', fontSize:'18px', color: "#7D7D7D"}}>
          <b>{item?.user?.firstname}&nbsp;{item?.user?.lastname}</b> &nbsp; {moment(item.createdDate).format('ll')}
        </div>
        </Col>
        <Col sm={1} style={{paddingTop:'5px', paddingLeft:'15px'}} >
              {(user?.userId === item?.userAccountId)?(
              <>
                {
                 moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm')) &&
                  <>

                  </>
                }
                {
                  moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm')) &&
                  moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm')) &&
                  <>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 10, hide: 25 }}
                    overlay={renderTooltipDelete}>
                      <Button onClick={() => handleDeleteNotify(item?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-trash-alt"></i></Button>
                    </OverlayTrigger>
                  </> 
                }
              </>
              ):(
              <></>)}
        </Col>
        </div>
        <Col sm={12}>
          <Form.Group className="mb-2">
            <Form.Control defaultValue={item.reply}  as="textarea" rows={2} disabled style={{resize:'none'}}  />
          </Form.Group>
        </Col>
      </Row>
        </>
          )
        }))}
      </>):(<></>)}
      {
        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm')) &&
          <>
          </>
      }
      {
       moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm')) &&
        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm')) &&
        <>
            <br />
          <Form>  
            <InputGroup size="sm">
              <FormControl onChange={(e) => setReply(e.target.value)} value={reply} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Reply" />
              <InputGroup.Text onClick={(e) => submitComment(e, discussionId)}  id="basic-addon2" className="comment-btn"><i className="fas fa-paper-plane"></i></InputGroup.Text>
            </InputGroup><br />
          </Form> 
        </> 
      }
      </Modal.Body>
    </Modal>
    <SweetAlert 
      success
      show={commentAlert} 
      title="Done!" 
      onConfirm={closeNotify}>
    </SweetAlert>
  </div>
  )
}

export default DiscussionComments
