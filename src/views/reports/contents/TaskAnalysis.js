import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col, Table, Button, Form, Modal} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TaskAnalysis({selectedClassId, taskAnalysis, setTaskAnalysis,  showTaskHeader, setShowTaskHeader}) {
  
  const [showTaskAnalysis, setShowTaskAnalysis] = useState([])
  const [loading, setLoading] = useState(false)
  const [sweetError, setSweetError] = useState(false)
  const [show, setShow] = useState(false);
  const [openModal, setOpenModal] = useState(false)
  const [taskGrade, setTaskGrade] = useState("")
  const [feedback, setFeedback] = useState("")
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [sClassId, setSClassId] = useState("")
  const [selectedTaskId, setSelectedTaskId] = useState("")
  const [selectedAnswerId, setSelectedAnswerId] = useState("")
  const [taskAnswer, setTaskAnswer] = useState({});

  let testname = sessionStorage.getItem('testName')
  let classid = sessionStorage.getItem('classId')
  let studentidsession = sessionStorage.getItem('studentid')
  let testidsession = sessionStorage.getItem('testid')

  const handleOpenModal = (e, studentid, classid, assignmentid, answerid, score, afeedback) => {
    e.preventDefault()
    setOpenModal(true)
    setSelectedStudentId(studentid)
    setSClassId(classid)
    setSelectedTaskId(assignmentid)
    setSelectedAnswerId(answerid)
    setTaskGrade(score)
    setFeedback(afeedback)
}

const updateScoreTask = async(e, studentid, classid, assignmentid, answerid) => {
  e.preventDefault()
  let isConsider = true
  let response = await new ClassesAPI().updateTaskPoints
  (
    selectedStudentId, sClassId, selectedTaskId, selectedAnswerId, {taskGrade, feedback}
  )
  if(response.ok){
    // setSweetError(true);
    setShow(true);
    setOpenModal(false)
    notifyUpdateTaskScore()
    getTaskAnalysis(e, selectedStudentId, sClassId, selectedTaskId)
  }else{
    alert(response.data.errorMessage)
  }
}

const addteScoreTask = async(e, studentid, classid, assignmentid, answerid) => {
  e.preventDefault()
  let isConsider = true
  let response = await new ClassesAPI().updateTaskPoints
  (
    selectedStudentId, sClassId, selectedTaskId, selectedAnswerId, {taskGrade, feedback}
  )
  if(response.ok){
    // setSweetError(true);
    setShow(true);
    setOpenModal(false)
    notifyAddTaskScore()
    getTaskAnalysis(e, selectedStudentId, sClassId, selectedTaskId)
  }else{
    alert(response.data.errorMessage)
  }
}

  const getTaskAnalysis = async(e, studentid, classid, taskid) => {
    e.preventDefault()
    setShowTaskAnalysis(true)
    let response = await new ClassesAPI().getTaskAnalysis(studentid, classid, taskid)
    if(response.ok){
      setTaskAnalysis(response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const getTaskAnswer = async(studentid, classid, assignmentid) => {
    let response = await new ClassesAPI().getStudentTaskAnwswer(studentid, classid, assignmentid)
    if(response.ok){
      setTaskAnswer(response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const cancelSweetError = () => {
    setSweetError(false)
  }

  useEffect(() => {
    if(taskAnalysis?.task){
      getTaskAnswer(studentidsession, classid, taskAnalysis?.task?.id)
    }
  }, [taskAnalysis])

  useEffect(() => {
    setSweetError(false)
    setShowTaskHeader(true)
  }, [])

  const notifyUpdateTaskScore = () => 
  toast.success('Successfully Updated Score', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const notifyAddTaskScore = () => 
  toast.success('Successfully Saved Score', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const  downloadImage = (url) => {
    fetch(url, {
      mode : 'no-cors',
    })
      .then(response => response.blob())
      .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.download = url.replace(/^.*[\\\/]/, '');
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  }

  return(
    <>
      <ToastContainer />
      <Row>
        {taskAnalysis.studentTask === null ?
          <Col md={12}>No Answer Yet </Col>
        :
          <>
            <Col md={12}>Task Name : {taskAnalysis.task?.taskName}</Col>
            <hr></hr>
            <Col md={12}>{taskAnalysis.studentTask?.taskAnswer}</Col>
            <hr></hr>
            <Col md={12}>{taskAnalysis.studentTask?.taskGrade}
            {taskAnalysis.studentTask?.taskGrade === null ? 
                          <Button variant="outline-warning" className='mb-2 mx-3' size="sm"
                          onClick={(e) => handleOpenModal(e, taskAnalysis.student.id, classid, taskAnalysis.task.id, taskAnalysis.studentTask.id, taskAnalysis.studentTask.taskGrade, taskAnalysis.studentTask.feedback )}
                        >
                          <i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>
                          Add Score
                        </Button>
                        :
                        <Button variant="outline-warning" className='mb-2 mx-3' size="sm"
                        onClick={(e) => handleOpenModal(e, taskAnalysis.student.id, classid, taskAnalysis.task.id, taskAnalysis.studentTask.id, taskAnalysis.studentTask.taskGrade, taskAnalysis.studentTask.feedback )}
                      >
                        <i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>
                        Update Score
                      </Button>  
          }

            </Col>
            <hr />
            <Col className='mb-3'>
              <Row>
                {
                  taskAnswer?.uploadedFiles?.map( itm => {
                    return (
                      <>
                        {/* {
                          itm.filePath.match(/.(jpg|jpeg|png|gif|pdf)$/i)
                          ?
                          <i class="fas fa-download td-file-page" onClick={() => downloadImage(itm.filePath)}></i>
                          : */}
                          <a href={itm.filePath} download={true} target='_blank'>
                            <i class="fas fa-download td-file-page"></i>
                          </a> 
                        {/* } */}
                      </>
                    )
                  })
                }
              </Row>
            </Col>
              {/* <Button variant="outline-warning" size="sm" onClick={(e) => handleOpenModal(e, taskAnalysis.student.id, classid, taskAnalysis.task.id, taskAnalysis.studentTask.id, taskAnalysis.studentTask.taskGrade, taskAnalysis.studentTask.feedback )}>
                <i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Update Score
              </Button> */}
            <hr></hr>
            <Col md={12}>{taskAnalysis.studentTask?.feedback}</Col>
          </>
        }
      </Row>
      <Modal size="lg" className="modal-all" show={openModal} onHide={()=> setOpenModal(!openModal)} backdrop="static">
        <Modal.Header className="modal-header" closeButton>
          {taskAnalysis.studentTask?.taskGrade === null ? <>Add Points</>:<>Update Points</>}
        </Modal.Header>
        <Modal.Body className="modal-label b-0px">
          <Form onSubmit={taskAnalysis.studentTask?.taskGrade === null ? addteScoreTask : updateScoreTask}>
            <Form.Group className="m-b-20">
              <Form.Label for="courseName">
                  Rate / Points
              </Form.Label>
              <Form.Control 
                defaultValue={taskGrade}
                className="custom-input" 
                size="lg" 
                type="text" 
                placeholder="Enter points"
                onChange={(e) => setTaskGrade(e.target.value)}
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
export default TaskAnalysis