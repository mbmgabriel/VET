import React, { useContext, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import moment from 'moment'
import ClassesAPI from '../../../../api/ClassesAPI'
import { UserContext } from '../../../../context/UserContext'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';


function StudentDiscussionComment({getDiscussionComments, getComments, studentCommentToggle, studentCommentModal, comments, discussionId, moduleId, getDiscussionUnit, startDate, startTime, endDate, endTime }) {
  const { id } = useParams()
  const userContext = useContext(UserContext)
  const { user } = userContext.data
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [commentAlert, setCommentAlert] = useState(false)
  const [itemId, setItemId] = useState('')
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  const dateTimeNow = dateCompareNow + ' ' + '00:00:00';
  const [reply, setReply] = useState('')
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const handleDeleteNotify = (item) => {
    getDiscussionUnit(null, moduleId)
    setDeleteNotify(true)
    setItemId(item)
  }

  const submitComment = async (e, item) => {
    e.preventDefault()
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 10000)
    let classId = id
    let userAccountId = user?.userId
    let response = await new ClassesAPI().submitComment(classId, item, { userAccountId, reply })
    if (response.ok) {
      setReply('')
      success()
      getDiscussionComments(null, item, startDate, startTime, endDate, endTime)
    } else {
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

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const closeNotify = () => {
    setCommentAlert(false)
  }

  const success = () => {
    toast.success('Successfully comment on discussion!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const deleteComment = async (item) => {
    let classId = id
    let response = await new ClassesAPI().deleteComment(classId, discussionId, item)
    if (response.ok) {
      console.log('moduleId:', moduleId)
      getDiscussionComments(null, discussionId, startDate, startTime, endDate, endTime)
      setDeleteNotify(false)
    } else {
      alert(response.data.errorMessage)
    }
  }

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
        You will not be able to recover your comment!
      </SweetAlert>
      <Modal size="lg" show={studentCommentModal} onHide={studentCommentToggle} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Discussion Comments
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form  >
            {(studentCommentModal === true) ? (<>
              {(getComments.map(item => {
                return (
                  <>
                    <Row>
                      <div className='inline-flex' >
                        <Col sm={11} className='inline-flex'>
                          <InputGroup.Text id="basic-addon2" className="feed-logo"><i class="fas fa-user-circle fas-1x" ></i></InputGroup.Text>
                          <div className='inline-flex' style={{ paddingTop: '12px', fontSize: '18px', color: "#7D7D7D" }}>
                            <b>{item?.user?.firstname}&nbsp;{item?.user?.lastname}</b> &nbsp; {moment(item.createdDate).format('ll')}
                          </div>
                        </Col>

                        <Col sm={1} style={{ paddingTop: '5px', paddingLeft: '15px' }} >
                          {(user?.userId === item?.userAccountId) ? (
                            <>
                              {
                                moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm')) &&
                                <></>
                              }
                              {
                                moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm')) &&
                                moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm')) &&
                                <>
                                  <Button onClick={() => handleDeleteNotify(item?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-trash-alt"></i></Button>
                                </>
                              }
                            </>
                          ) : (
                            <></>)}
                        </Col>
                      </div>
                      <Col sm={12}>
                        <Form.Group className="mb-2">
                          <Form.Control defaultValue={item.reply} as="textarea" rows={2} disabled style={{ resize: 'none' }} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )
              }))}
            </>) : (<></>)}
          </Form>
          {
            moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm')) &&
            moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm')) &&
            <>
              <br />
              {!user.isSchoolAdmin &&  <Form onSubmit={(e) => submitComment(e, discussionId)} >
                <InputGroup size="sm">
                  <FormControl onChange={(e) => setReply(e.target.value)} value={reply} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Reply" />
                  {/* <InputGroup.Text disabled={isButtonDisabled} onClick={(e) => submitComment(e, discussionId)} id="basic-addon2" className="comment-btn"><i className="fas fa-paper-plane"></i></InputGroup.Text> */}
                  <Button onClick={(e) => submitComment(e, discussionId)} disabled={isButtonDisabled} className='btn-like' size="sm" Button variant="link"><i className="fas fa-paper-plane"></i></Button>
                </InputGroup><br />
              </Form>}
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

export default StudentDiscussionComment
