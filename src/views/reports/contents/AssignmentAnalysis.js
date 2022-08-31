import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Button, Form, Modal } from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {UserContext} from '../../../context/UserContext';

function AssignmentAnalysis({ assignmentAnalysis, setAssignmentAnalysis }) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
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
  let totalRate = assignmentAnalysis?.assignment?.rate;

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
    
  }, [assignmentAnalysis])

  const getAssignmentAnswer = async (studentid, classid, assignmentid) => {
    let response = await new ClassesAPI().getStudentAssignmentAnswer(studentid, paramsId, assignmentid)
    if (response.ok) {
      setAssignmentAnswer(response.data)
    }
  }

  const addScoreAssignment = async (e) => {
    e.preventDefault()
    if( (assignmentGrade == '') || (assignmentGrade < 0) || (assignmentGrade == null)){
      toast.error('Points cannot be empty!')
    }else{
      await new ClassesAPI().updateAssignmentPoints
      (
        selectedStudentId,
        sClassId,
        selectedAssignmentId,
        selectedAnswerId,
        { assignmentGrade, feedback }
      )
      setOpenModal(false)
      notifySaveAssignmentScore()
      getAssignmentAnalysis(e, selectedStudentId, sClassId, selectedAssignmentId)
    }
  }

  const updateScoreAssignment = async (e) => {
    e.preventDefault()
    if( (assignmentGrade == '') || (assignmentGrade < 0) ){
      toast.error('Points cannot be less than 0')
    }else{
      await new ClassesAPI().updateAssignmentPoints
      (
        selectedStudentId,
        sClassId,
        selectedAssignmentId,
        selectedAnswerId,
        { assignmentGrade, feedback }
      )
      setOpenModal(false)
      notifyUpdateAssignmentScore()
      getAssignmentAnalysis(e, selectedStudentId, sClassId, selectedAssignmentId)
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

    console.log('1012:', assignmentAnalysis)

  return (
    <>
      <ToastContainer />
      <Row>
        {assignmentAnalysis.studentAssignment === null ?
          <Col md={12}>No Answer Yet</Col>
          :
          <>
            <hr></hr>
            <Col md={12}>Answer: {assignmentAnalysis.studentAssignment?.assignmentAnswer}</Col>
            <hr></hr>
            <Col md={12}>
              Grade: {assignmentAnalysis.studentAssignment?.assignmentGrade}
              {user.isTeacher &&
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
                    )}
                    >
                  <i class="fas fa-redo" style={{ paddingRight: '10px' }} />{assignmentAnalysis.studentAssignment?.assignmentGrade === null ? 'Add Points' : 'Update Points'}
                </Button>
              }
            </Col>
            <Col className='mb-3'>
              Click to view the files: &nbsp;
         
                {
                  assignmentAnswer?.uploadedFiles?.map(itm => {
                    return (
                      <>
                        <a href={itm.filePath} download={true} target='_blank'>
                          <span style={{fontSize:'30px'}} ><i class="fas fa-download td-file-page"></i></span>
                        </a>
                      </>
                    )
                  })
                }
          
            </Col>
            <hr></hr>
            <Col md={12}>Feedback: {assignmentAnalysis.studentAssignment?.feedback}</Col>
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
              <Form.Label for="courseName">Total Rate / Points: {totalRate}</Form.Label>
              <Form.Control
                defaultValue={assignmentGrade}
                className="custom-input"
                size="lg"
                type="number"
                placeholder="Enter points"
                onChange={(e) => {
                  setAssignmentGrade(e.target.value);
                  if(e?.target?.value > totalRate){
                    toast.error('Points must not be greater than the total rate.');
                  }else{
                    setAssignmentGrade(e.target.value);
                  }
                }}
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
            {
             assignmentGrade <= totalRate  &&
              <span style={{ float: "right" }}>
                  {
                    assignmentAnalysis.studentAssignment?.assignmentGrade === null
                      ? <Button className="tficolorbg-button" type="submit">Save Points</Button>
                      : <Button className="tficolorbg-button" type="submit">Update Points</Button>
                  }   
                </span>
            }
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AssignmentAnalysis;