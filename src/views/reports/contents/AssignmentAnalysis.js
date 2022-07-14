import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Form, Modal } from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AssignmentAnalysis({ assignmentAnalysis, setAssignmentAnalysis }) {
  const [openModal, setOpenModal] = useState(false)
  const [assignmentGrade, setAssignmentGrade] = useState("")
  const [feedback, setFeedback] = useState("")
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [sClassId, setSClassId] = useState("")
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("")
  const [selectedAnswerId, setSelectedAnswerId] = useState("")
  const [assignmentAnswer, setAssignmentAnswer] = useState({})
  const pageURL = new URL(window.location.href);
  const paramsId = pageURL.searchParams.get("classId");
  let studentidsession = sessionStorage.getItem('studentid')

  const handleOpenModal = (e, studentid, assignmentid, answerid, score, afeedback) => {
    e.preventDefault()
    setOpenModal(true)
    setSelectedStudentId(studentid)
    setSClassId(paramsId)
    setSelectedAssignmentId(assignmentid)
    setSelectedAnswerId(answerid)
    setAssignmentGrade(score)
    setFeedback(afeedback)
  }

  const getAssignmentAnalysis = async (e, studentid, classid, assignmentid) => {
    e.preventDefault()
    let response = await new ClassesAPI().getAssignmentAnalysis(studentid, classid, assignmentid)
    if (response.ok) {
      setAssignmentAnalysis(response.data)
    } else {
      toast.error(response.data.ErrorMessage)
    }
  }

  useEffect(() => {
    if (assignmentAnalysis?.studentAssignment != null) {
      getAssignmentAnswer(studentidsession, paramsId, assignmentAnalysis?.assignment?.id)
    }
    
  }, [])

  const getAssignmentAnswer = async (studentid, classid, assignmentid) => {
    let response = await new ClassesAPI().getStudentAssignmentAnswer(studentid, paramsId, assignmentid)
    if (response.ok) {
      setAssignmentAnswer(response.data)
    }
  }

  const addScoreAssignment = async (e) => {
    e.preventDefault()
    let response = await new ClassesAPI().updateAssignmentPoints
      (
        selectedStudentId,
        sClassId,
        selectedAssignmentId,
        selectedAnswerId,
        { assignmentGrade, feedback }
      )
    if (response.ok) {
      setOpenModal(false)
      notifySaveAssignmentScore()
      getAssignmentAnalysis(e, selectedStudentId, sClassId, selectedAssignmentId)
    } else {
      alert(response.data.errorMessage)
    }
  }

  const updateScoreAssignment = async (e) => {
    e.preventDefault()
    let response = await new ClassesAPI().updateAssignmentPoints
      (
        selectedStudentId,
        sClassId,
        selectedAssignmentId,
        selectedAnswerId,
        { assignmentGrade, feedback }
      )
    if (response.ok) {
      setOpenModal(false)
      notifyUpdateAssignmentScore()
      getAssignmentAnalysis(e, selectedStudentId, paramsId, selectedAssignmentId)
    } else {
      toast.error(response.data.ErrorMessage)
    }
  }

  const notifyUpdateAssignmentScore = () =>
    toast.success('Successfully Updated Points', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const notifySaveAssignmentScore = () =>
    toast.success('Successfully Saved Points', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <>
      <ToastContainer />
      <Row>
        {assignmentAnalysis.studentAssignment === null ?
          <Col md={12}>No Answer Yet</Col>
          :
          <>
            <Col md={12}>Assignment Name: {assignmentAnalysis.assignment?.assignmentName}</Col>
            <hr></hr>
            <Col md={12}>{assignmentAnalysis.studentAssignment?.assignmentAnswer}</Col>
            <hr></hr>
            <Col md={12}>
              {assignmentAnalysis.studentAssignment?.assignmentGrade}
              {assignmentAnalysis.studentAssignment?.assignmentGrade === null ?
                <Button
                  variant="outline-warning"
                  size="sm"
                  className='mx-3 mb-2'
                  onClick={(e) => handleOpenModal
                    (
                      e,
                      assignmentAnalysis.student.id,
                      assignmentAnalysis.assignment.id,
                      assignmentAnalysis.studentAssignment.id,
                      assignmentAnalysis.studentAssignment.assignmentGrade,
                      assignmentAnalysis.studentAssignment.feedback
                    )}>
                  <i class="fas fa-redo" style={{ paddingRight: '10px' }} />Add Points
                </Button>
                :
                <Button
                  variant="outline-warning"
                  size="sm"
                  className='mx-3 mb-2'
                  onClick={(e) => handleOpenModal(
                    e,
                    assignmentAnalysis.student.id,
                    assignmentAnalysis.assignment.id,
                    assignmentAnalysis.studentAssignment.id,
                    assignmentAnalysis.studentAssignment.assignmentGrade,
                    assignmentAnalysis.studentAssignment.feedback
                  )}>
                  <i class="fas fa-redo" style={{ paddingRight: '10px' }} ></i>Update Points
                </Button>
              }
            </Col>
            <Col className='mb-3'>
              <Row>
                {
                  assignmentAnswer?.uploadedFiles?.map(itm => {
                    return (
                      <>
                        <a href={itm.filePath} download={true} target='_blank'>
                          <i class="fas fa-download td-file-page"></i>
                        </a>
                      </>
                    )
                  })
                }
              </Row>
            </Col>
            <hr></hr>
            <Col md={12}>{assignmentAnalysis.studentAssignment?.feedback}</Col>
          </>
        }
      </Row>

      <Modal size="lg" className="modal-all" show={openModal} onHide={() => setOpenModal(!openModal)} backdrop="static">
        <Modal.Header className="modal-header" closeButton>
          {assignmentAnalysis.studentAssignment?.assignmentGrade === null ? <>Add Points</> : <>Update Points</>}
        </Modal.Header>
        <Modal.Body className="modal-label b-0px">
          <Form onSubmit={assignmentAnalysis.studentAssignment?.assignmentGrade === null ? addScoreAssignment : updateScoreAssignment}>
            <Form.Group className="m-b-20">
              <Form.Label for="courseName">Rate / Points</Form.Label>
              <Form.Control
                defaultValue={assignmentGrade}
                className="custom-input"
                size="lg"
                type="text"
                placeholder="Enter points"
                onChange={(e) => setAssignmentGrade(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-b-20">
              <Form.Control
                defaultValue={feedback}
                className="custom-input"
                size="lg"
                type="text"
                placeholder="Enter feedback"
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Form.Group>

            <span style={{ float: "right" }}>
              {
                assignmentAnalysis.studentAssignment?.assignmentGrade === null
                  ? <Button className="tficolorbg-button" type="submit">Save Points</Button>
                  : <Button className="tficolorbg-button" type="submit">Update Points</Button>
              }
            </span>

          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AssignmentAnalysis;