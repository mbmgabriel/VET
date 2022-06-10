import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col, Table, Button, Form, Modal} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'
import ContentViewer from '../../../components/content_field/ContentViewer';

function ExamAnalysis({classesModules, setClassesModules, selectedClassId, examAnalysis, setExamAnalysis, testPartAnswers, showReportHeader, setShowReportHeader}) {
  
  const [showExamAnalysis, setShowExamAnalysis] = useState([])
  const [considerAnswer, setConsiderAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedExam, setSelectedExam] = useState([])
  const [selectedRate, setSelectedRate] = useState("")
  const [selectedQuestionId, setSelectedQuestionId] = useState("")
  const [selectedAnswerId, setSelectedAnswerId] = useState("")
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [selectedTestId, setSelectedTestId] = useState("")
  const [studentScore, setStudentScore] = useState("")
  const [sweetError, setSweetError] = useState(false)
  const [show, setShow] = useState(false);
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  const dateTimeNow = dateCompareNow + ' ' + '00:00:00';

  let testname = sessionStorage.getItem('testName')
  let classid = sessionStorage.getItem('classId')
  let studentidsession = sessionStorage.getItem('studentid')
  let testidsession = sessionStorage.getItem('testid')

  const handleOpenModal = (e, questionid, answerid, studentid, testid, rate) => {
    e.preventDefault()
    setOpenModal(true)
    setStudentScore(rate)
    setSelectedStudentId(studentid)
    setSelectedTestId(testid)
    setSelectedAnswerId(answerid)
    setSelectedQuestionId(questionid)
}

  const getExamAnalysis = async(e, studentid, classid, testid) => {
    e.preventDefault()
    setShowExamAnalysis(true)
    let response = await new ClassesAPI().getExamAnalysis(studentid, classid, testid)
    if(response.ok){
      setExamAnalysis(response.data)
      
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  const considerAnswerExamT = async(e, questionid, answerid, studentid, testid, rate) => {
    e.preventDefault()
    let isConsider = true
    let response = await new ClassesAPI().considerAnswerExamTrue
    (
      studentid, classid, testid, answerid, {isConsider}
    )
    if(response.ok){
    }else{
      alert(response.data.errorMessage)
    }
  }



  const considerAnswerExamF = async(e, questionid, answerid, studentid, testid, rate) => {
    e.preventDefault()
    let isConsider = false
    let response = await new ClassesAPI().considerAnswerExamTrue
    (
      studentid, classid, testid, answerid, {isConsider}
    )
    if(response.ok){
      notifyUnconsidered()
      getExamAnalysis(e, studentidsession, classid, testidsession)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const updatePoints = async(e, questionid, answerid, studentid, testid, rate) => {
    e.preventDefault()
    let isConsider = true
    let response = await new ClassesAPI().updateExamPoints
    (
      selectedStudentId, classid, selectedTestId, selectedAnswerId, {isConsider, studentScore}
    )
    if(response.ok){
      // setSweetError(true);
      setShow(true);
      setOpenModal(false)
      notifyConsidered()
      getExamAnalysis(e, selectedStudentId, classid, selectedTestId)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const retakeExam = async(e, questionid, answerid, studentid, testid, rate) => {
    e.preventDefault()
    let isConsider = true
    let response = await new ClassesAPI().retakeExam
    (
      selectedStudentId, classid, selectedTestId, selectedAnswerId, {isConsider, studentScore}
    )
    if(response.ok){
      // setSweetError(true);
      setShow(true);
      setOpenModal(false)
      getExamAnalysis(e, selectedStudentId, classid, selectedTestId)
    }else{
      alert(response.data.errorMessage)
    }
  }


  const handleInputChange = (e, questionid, answerid, studentid, testid, rate) => {
    e.preventDefault()
    setConsiderAnswer(true)
    isChecked(e, e.target.checked, questionid, answerid, studentid, testid, rate);
  }

  const isChecked = (e, etc, questionid, answerid, studentid, testid, rate) => {
    let haru = etc
        if(haru === true){
          considerAnswerExamT(e, questionid, answerid, studentid, testid, rate)
          handleOpenModal(e, questionid, answerid, studentid, testid, rate)
        }else{
          considerAnswerExamF(e, questionid, answerid, studentid, testid, rate)
          
        }
  }

  const cancelSweetError = () => {
    setSweetError(false)
  }

  useEffect(() => {
    setSweetError(false)
    setShowReportHeader(true)
    if(studentScore !== null) {
			setStudentScore(studentScore)
		}
  }, [studentScore])

  const notifyConsidered = () => 
  toast.success('Considered', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const notifyUnconsidered = () => 
  toast.warning('Unconsidered', {
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
      <Col md={6}>
        <span className='font-exam-analysis-header'>{examAnalysis.student?.lname},  {examAnalysis.student?.fname}</span>
      </Col>
      <Col md={6}>
        <span className='font-exam-analysis-header float-right'>{examAnalysis.score} / {examAnalysis.assignedRawScore}</span>
      </Col>
      <Col md={6}>
        <p className='font-exam-analysis-content-24-tfi'>{testname} </p>
      </Col>
      <Col md={6}>
        <p className='font-exam-analysis-content-24-tfi float-right'>{moment(examAnalysis.classTest?.startDate).format("LL")} </p>
      </Col>
    </Row>
      {examAnalysis.testPartAnswers?.map((item, index) => {
        return(
            <div>
            <div className='inline-flex'>
              <p className='font-exam-analysis-content-24-tfi'>PART {index + 1}</p> <p style={{marginLeft:5}} className='font-exam-analysis-content-24' dangerouslySetInnerHTML={{__html:item.testPart.instructions }}/>
            </div>
              {item.questionDetails.map((qd, index) => {
                return(
                qd.answerDetails.map((ad, index) => {
                  return(
                    <>
                    <br></br>
                    <div className='inline-flex'>
                      <span className='font-exam-analysis-content-24' style={{marginBottom:"100px !important"}}>{index + 1}.</span> <span className='font-exam-analysis-content-24'><ContentViewer>{ad.assignedQuestion}</ContentViewer></span>
                    </div>
                    <Row style={{textAlign:'center', padding:10}}>
                      <Col sm={6} style={{border:"1px solid gray", paddingTop:10, borderRadius:5}}>
                        <div>
                          <span className='font-exam-analysis-content-24' style={{marginRight:10}}> 
                          <span style={{marginRight:10}}>{ad.studentScore === 1 && <i className="fa fa-1x fa-check-circle" style={{color:"green", marginLeft:"10px"}}></i>}</span>
                            Student Answer :</span><span className='font-exam-analysis-content-24'>
                            <ContentViewer>{ad.studentAnswer}</ContentViewer>
                          </span>
                          
                        </div>
                      </Col>
                      <Col sm={6} style={{border:"1px solid gray", paddingTop:10, borderRadius:5}}>
                      <div>
                        <span className='font-exam-analysis-content-24' style={{marginRight:10}}>Correct Answer :</span>
                        <span className='font-exam-analysis-content-24' style={{marginRight:10}}><ContentViewer>{ad.assignedAnswer}</ContentViewer></span>
                        </div>
                        {ad.studentScore === 0 &&
                        <Form>
                          <div style={{display:'inline-flex'}}>
                          <Form.Group className="m-b-20">
                            <Form.Check
                            label="Consider"
                            name={"answerid" + ad.id}
                            type="checkbox"
                            checked={ad.isConsider}
                            onChange={(e) => handleInputChange(e, ad.questionId, ad.id, ad.studentId, item.testPart.testId, qd.questionRate)}
                            /> 
                          </Form.Group>
                          <span>{ad.isConsider == true &&  <i className="fa fa-check-circle" style={{color:"green", marginLeft:"10px"}}></i>}</span>
                          <span>{ad.isConsider == false &&  <i class='fa fa-times-circle' style={{color:"red", marginLeft:"10px"}}></i>}</span>
                          {' '}
                          </div>
                        </Form>
                        } 
                      </Col>
                    </Row>
                    <hr></hr>
                    </>
                  )
                })
                )
              })}
              <SweetAlert success title="Good job!" 
                show={sweetError} onConfirm={cancelSweetError} onCancel={cancelSweetError}>
                  You clicked the button!
              </SweetAlert>
            </div>
        )
      })}
     

      <Modal size="lg" className="modal-all" show={openModal} onHide={()=> setOpenModal(!openModal)} backdrop="static">
				<Modal.Header className="modal-header" closeButton>
				Update Points
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={updatePoints}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Rate / Points
										</Form.Label>
										<Form.Control 
                      defaultValue={studentScore}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter points"
                      onChange={(e) => setStudentScore(e.target.value)}
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
export default ExamAnalysis