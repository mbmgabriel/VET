import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col, Table, Button, Form, Modal} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AssignmentAnalysis({selectedClassId, assignmentAnalysis, setAssignmentAnalysis,  showAssignmentHeader, setShowAssignmentHeader}) {
  
  const [showAssignmentAnalysis, setShowAssignmentAnalysis] = useState([])
  const [loading, setLoading] = useState(false)
  const [sweetError, setSweetError] = useState(false)
  const [show, setShow] = useState(false);
  const [openModal, setOpenModal] = useState(false)

  const [assignmentGrade, setAssignmentGrade] = useState("")
  const [feedback, setFeedback] = useState("")
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [sClassId, setSClassId] = useState("")
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("")
  const [selectedAnswerId, setSelectedAnswerId] = useState("")

  let testname = sessionStorage.getItem('testName')
  let classid = sessionStorage.getItem('classId')
  let studentidsession = sessionStorage.getItem('studentid')
  let testidsession = sessionStorage.getItem('testid')

  const handleOpenModal = (e, studentid, classid, assignmentid, answerid, score, afeedback) => {
    e.preventDefault()
    setOpenModal(true)
    setSelectedStudentId(studentid)
    setSClassId(classid)
    setSelectedAssignmentId(assignmentid)
    setSelectedAnswerId(answerid)
    setAssignmentGrade(score)
    setFeedback(afeedback)
}


  const getAssignmentAnalysis = async(e, studentid, classid, assignmentid) => {
    e.preventDefault()
    console.log(selectedClassId)
    setShowAssignmentAnalysis(true)
    console.log(showAssignmentAnalysis)
    let response = await new ClassesAPI().getAssignmentAnalysis(studentid, classid, assignmentid)
    if(response.ok){
      setAssignmentAnalysis(response.data)
      console.log(response.data)
      
    }else{
      alert(response.data.errorMessage)
    }
  }

  const updateScoreAssignment = async(e, studentid, classid, assignmentid, answerid) => {
    e.preventDefault()
    let isConsider = true
    let response = await new ClassesAPI().updateAssignmentPoints
    (
      selectedStudentId, sClassId, selectedAssignmentId, selectedAnswerId, {assignmentGrade, feedback}
    )
    if(response.ok){
      // setSweetError(true);
      setShow(true);
      setOpenModal(false)
      notifyUpdateAssignmentScore()
      getAssignmentAnalysis(e, selectedStudentId, sClassId, selectedAssignmentId)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const cancelSweetError = () => {
    setSweetError(false)
  }

  useEffect(() => {
    setSweetError(false)
    setShowAssignmentHeader(false)
  }, [])

  const notifyUpdateAssignmentScore = () => 
  toast.success('Score Saved', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  return(
  <>
    <ToastContainer />
		<Row>
      {assignmentAnalysis.studentAssignment === null ?
      <Col md={12}>No Answer Yet</Col>
      :
        <>
          <Col md={12}>Assignment Name : {assignmentAnalysis.assignment?.assignmentName}</Col>
          <hr></hr>
          <Col md={12}>{assignmentAnalysis.studentAssignment?.assignmentAnswer}</Col>
          <hr></hr>
          
          <Col md={12}>{assignmentAnalysis.studentAssignment?.assignmentGrade}
            {/* <Button variant="outline-warning" size="sm" onClick={(e) => updateScoreAssignment(e, assignmentAnalysis.student.id, classid, assignmentAnalysis.assignment.id, assignmentAnalysis.studentAssignment.id)}>
              <i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Update Score
            </Button> */}
            <Button variant="outline-warning" size="sm" onClick={(e) => handleOpenModal(e, assignmentAnalysis.student.id, classid, assignmentAnalysis.assignment.id, assignmentAnalysis.studentAssignment.id, assignmentAnalysis.studentAssignment.assignmentGrade, assignmentAnalysis.studentAssignment.feedback )}>
              <i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Update Score
            </Button>
          </Col>
          <hr></hr>
          <Col md={12}>{assignmentAnalysis.studentAssignment?.feedback}</Col>
        </>
      }
    </Row>
    <Modal size="lg" className="modal-all" show={openModal} onHide={()=> setOpenModal(!openModal)} backdrop="static">
				<Modal.Header className="modal-header" closeButton>
				Update Points
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={updateScoreAssignment}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Rate / Points
										</Form.Label>
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
								<span style={{float:"right"}}>
										<Button className="tficolorbg-button" type="submit">
												Save
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
  </> 
  )
}
export default AssignmentAnalysis